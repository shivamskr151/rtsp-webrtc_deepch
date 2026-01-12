FROM golang:1.18

# Install Node.js for building React app
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /go/src/app
COPY .  .

# Build React app
WORKDIR /go/src/app/web/react-app
RUN npm install && npm run build

# Build Go app
WORKDIR /go/src/app
RUN go get -d -v ./...
RUN go install -v ./...

EXPOSE 8083

ENV GO111MODULE=on
ENV GIN_MODE=release

CMD go run *.go