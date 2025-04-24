# Notebook

A flow based note-taking tool.

*Note: This project is currently in the early stages of development*

## Screenshots

![preview.png](https://github.com/user-attachments/assets/d2f47f00-d6bc-480e-b22e-844e8a88437a)

https://github.com/user-attachments/assets/96fe66fc-0408-4f7c-af7d-5971e6fdc898

## Features

1. You can add text nodes to record thoughts.

2. Add lines between nodes to illustrate the relationship between two thoughts.

3. You can place prompt text in the node and then use the AI ​​model to assist writing. The generation process will refer to the content of the associated node!

4. You can upload or generate images and use them to generate other content.

## Features in development

1. Supports file type nodes for uploading documents, slides, tables, etc.

2. Supports multi-person collaborative editing, allowing joint creation through shared links.

3. Export the entire file as a report, or a file that can be imported into other note-taking applications such as Obsidian.

4. Support flow nesting, referencing other files as nodes into the current flow.

## Run in development mode

### 1. start backend

currently backend is implemented by Node.js, project location: [server-nodejs/](server-nodejs/)

#### 1.1 Dependencies

1. Docker Compose, to run the following services:

    - **MinIO & MinIO OBJECT STORE**: to store user's uploaded images, and llm's generated images.

       *This service is optional, you can switch to any other S3 service.*

    - **sqlite-web**: to view data in database, if using sqlite as database.

       *This service is optional.*

    - **MySQL**: to store data.

       *This service is optional, check [1.2 Steps / prepare environment](#12-steps) below.*

    - **phpMyAdmin**: to view data in database, if using mysql as database.

      *This service is optional.*

    - **Inngest**: to run async asynchronous tasks like calling llm for generating content.

      **This service is required.**

2. nodejs

#### 1.2 Steps

1. create app config file: `server-nodejs/config/app.yaml`, configurations can be found in [server-nodejs/config/app.example.yaml](server-nodejs/config/app.example.yaml)

2. create aksk config file: `server-nodejs/config/aksk.yaml`, configurations in this file can override `app.yaml`, used to store secrets like LLM's API Keys.

3. install dependencies: `npm -g install pnpm && pnpm install`

4. prepare environment: `pnpm compose:mysql` or `pnpm compose:sqlite`, depends on `db.type` in [server-nodejs/config/app.yaml](./server-nodejs/config/app.yaml)

5. start the server: `pnpm start:dev`

#### 1.3 Running services

- **Backend server**: http://localhost:9001
- **API Swagger**: http://localhost:9001/api-docs
- **MinIO OBJECT STORE**: http://localhost:9101
  
  `minioadmin/minioadmin`

- **sqlite-web**: http://localhost:9105
- **MySQL**: http://localhost:9106
  
  `root/password`

- **phpMyAdmin**: http://localhost:9107

  `root/password`

- **Inngest**: http://localhost:9108

![swagger.png](https://github.com/user-attachments/assets/58bfcc62-c329-4c97-942d-450998fc41cf)

![sqlite-web.png](https://github.com/user-attachments/assets/13dfe81e-4cd3-4691-8724-c10656cd72d8)

![phpmyadmin.png](https://github.com/user-attachments/assets/bbae65a2-dafa-49ae-87c5-a56052f2206b)

![inngest.png](https://github.com/user-attachments/assets/8c29c7f1-9b7d-4c4d-9c49-9472ffaa7963)

### 2. start frontend

project location: [web/](web/)

#### 2.1 Dependencies

1. nodejs

#### 2.2 Steps

1. install dependencies: `npm -g install pnpm && pnpm install`

2. start the dev server: `pnpm dev`

#### 2.3 Running services

- Frontend dev server: http://localhost:9000

## Run in Docker (backend and frontend only)

### 1. Build app image

```bash
docker rmi notebook # optional, to delete legacy built image
docker build -t notebook -f Dockerfile .
```

### 2. Run app

#### 2.1 Prepare environment

1. MySQL service is running

    **optional, required if using mysql as database**

2. Inngest service is running

    **required**

#### 2.2 Prepare config file

1. create app config file: `app-docker.yaml`, configurations can be found in [server-nodejs/config/app-docker.example.yaml](server-nodejs/config/app-docker.example.yaml)

2. create aksk config file: `aksk.yaml`, configurations in this file can override `app.yaml`, used to store secrets like LLM's API Keys.

    ```bash
    APP_CONFIG=$(pwd)/app-docker.yaml
    AKSK_CONFIG=$(pwd)/aksk.yaml
    SQLITE=$(pwd)/server-nodejs/database/notebook.db # optional, required if using sqlite as database
    
    docker run --rm -it \
      -v "$APP_CONFIG":/app/config/app.yaml:ro \
      -v "$AKSK_CONFIG":/app/config/aksk.yaml:ro \
      -v "$SQLITE":/app/database/notebook.db \
      --add-host=host.docker.internal:host-gateway \
      -p 3000:3000 notebook
    ```

3. add app to Inngest Dev Server, url is `{inngest.register.serveHost}{inngest.register.servePath}` from config file

4. app is running at localhost:3000