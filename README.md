# Portfolio Project #2: Thread Overflow

## Description

Thread Overflow is a forum-like web application but with real-time support for new messages and added upvote/downvote functionality.

>Disclaimer: The purpose of these projects is to showcase my knowledge of technologies, libraries and concepts in a simple application, it is expected to be a small-scaled application, the focus should be on the use cases of said technologies, libraries and concepts.

## Technologies and Libraries

The following technologies/libraries/concepts were used:

Server:

* Language - [`Javascript (Node)`](https://nodejs.org/en/)
* Framework - [`Express`](https://expressjs.com/)
* CORS
* Database - [`MongoDB`](https://www.mongodb.com/)
* ODM - [`Mongoose`](https://mongoosejs.com/)
* Authentication - [`JWT`](https://jwt.io/)
* Logging - [`morgan`](https://www.npmjs.com/package/morgan) and [`winston`](https://www.npmjs.com/package/winston)
* Real-Time Communication - [`socket.io`](https://socket.io/)

Client:

* SPA Framework/Library - [`Vue`](https://vuejs.org/) and [`React`](https://reactjs.org/) (Hooks)
* HttpClient - [`axios`](https://www.npmjs.com/package/axios)
* UI Library - [`Vuetify`](https://vuetifyjs.com/en/) (Vue) and [`Material-UI`](https://material-ui.com/) (React)
* State Management - Custom Implementation using Vue object (Vue) and [`RxJS`](https://rxjs-dev.firebaseapp.com/guide/overview) (React)
* Real-Time Communication - [`socekt.io client`](https://socket.io/)
* Routing - [`vue-router`](https://router.vuejs.org/) and [`react-router`](https://reactrouter.com/)


## Running the Project

You need to install the following:

* [Node and NPM](https://nodejs.org/en/download/)
* [Nodemon](https://www.npmjs.com/package/nodemon)
* [MongoDB](https://www.mongodb.com/try/download/community)


Clone Repo:
```
> git clone https://github.com/itsdaniellucas/thread-overflow

or using GitHub CLI
> gh repo clone itsdaniellucas/thread-overflow
```

Run DB/Server:

Before anything, you need to setup MongoDB in your machine (see [this guide](https://docs.mongodb.com/manual/administration/install-community/)). Say you didn't install it as a service, on `Windows` and chose the db path as `C:\data\db` you can then run the following (assuming you added `mongod` to your PATH environment)

```
> cd C:\data\db
> mongod

now run the server
> cd thread-overflow\src\server-node
> npm install
> nodemon server
```

Run Client:
```
> cd thread-overflow\src\client-vue
> npm install
> npm run serve

or React client
> cd thread-overflow\src\client-react
> npm install
> npm run start
```

Default Users:
|   Username    |   Password    |   Description                                                                                 |
|---------------|---------------|-----------------------------------------------------------------------------------------------|
|   user1       |   user1       |   Create/delete threads, create/modify/delete messages, upvote/downvote threads and messages  |
|   user2       |   user2       |   *same as user1*                                                                             |
|   (anonymous) |   (anonymous) |   View threads and messages                                                                   |

## License

MIT