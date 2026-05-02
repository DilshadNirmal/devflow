FROM golang:1.24-alpine
WORKDIR /app
ENV GOTOOLCHAIN=auto
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o runner .
CMD ["./runner"]