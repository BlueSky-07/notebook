# Notebook

A platform for recording your thoughts.

*Note: This project is currently in the early stages of development*

## Features

1. You can add text nodes to record thoughts.

2. Add lines between nodes to illustrate the relationship between two thoughts.

3. You can put a prompt text in the node, and then use AI to generate content. The generation process will refer to the content of associated nodes!

## Features in development

1. Image node, used to upload your photos.

2. File node, used to upload your documents, slides, tables, etc.

3. Collaborative editing by multiple people, sharing links to participate in joint creation.

4. You can export the entire file as a report, or a file that can be imported into other note apps like Obsidian.

5. File nesting, supports referencing other files as a node of the current file.

6. Generate images by AI.

## Run the project in development mode

### server-nodejs

#### Dependencies

1. Docker Compose: Run Mysql/Inngest/phpMyAdmin

2. nodejs

3. OpenJDK: Generate front-end project API interface files by OpenAPI documents

#### Steps

1. `npm -g install pnpm && pnpm install`

2. `pnpm compose:up`

3. `pnpm start:dev`

#### Running services

1. Backend server: http://localhost:9001

2. Mysql: http://localhost:9106, root/password

3. phpMyAdmin: http://localhost:9107, root/password

4. Inngest: http://localhost:9108

5. Swagger: http://localhost:9001/api-docs

### web

#### Dependencies

1. nodejs

#### Steps

1. `npm -g install pnpm && pnpm install`

2. `pnpm dev`

#### Running services

1. Frontend dev server: http://localhost:9000