package executor

import (
	"bufio"
	"context"
	"devflow/runner/models"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

func Execute(pipeline models.Pipeline, run models.Run) error {
	ctx := context.Background()

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())

	if err != nil {
		return err
	}
	defer cli.Close()

	for _, step := range pipeline.Steps {
		// Here you would implement the logic to execute each step in the pipeline
		resp, err := cli.ContainerCreate(ctx, &container.Config{
			Image: pipeline.DockerImage,
			Cmd: []string{"sh", "-c", step.Command},
		}, nil, nil, nil, "")

		if err  != nil {
			return err
		}

		err = cli.ContainerStart(ctx, resp.ID, container.StartOptions{})
		if err != nil {
			return err
		}

		logReader, err := cli.ContainerLogs(ctx, resp.ID, container.LogsOptions{
			ShowStdout: true,
			ShowStderr: true,
			Follow: true,
		})

		if err != nil {
			return err
		}
		defer logReader.Close()
		
		scanner := bufio.NewScanner(logReader)
		for scanner.Scan() {
			line := scanner.Text()
			log.Println(line)
			_, _ = http.Post(
				fmt.Sprintf("http://localhost:3000/api/runs/%s/logs", run.ID.Hex()),
				"application/json",
				strings.NewReader(fmt.Sprintf(`{"log": "%s"}`, line)),
			)
		}

		if err := scanner.Err(); err != nil {
			return err
		}

		statusCh, errCh := cli.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
		select {
		case err := <-errCh:
			if err != nil {
				return err
			}
		case <-statusCh:
		}

		err = cli.ContainerRemove(ctx, resp.ID, container.RemoveOptions{})
		if err != nil {
			return err
		}
	}

	return nil
}