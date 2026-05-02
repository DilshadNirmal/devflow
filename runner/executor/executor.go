package executor

import (
	"context"
	"devflow/runner/models"

	"io"
	"os"

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
		io.Copy(os.Stdout, logReader)

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