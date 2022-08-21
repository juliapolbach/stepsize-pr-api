# **Stepsize Pull Requests API**

This project is a code proposal for Stepsize Backend take-home task. 
An API that integrates with any code hosting provider and allows users to track and merge pull requests, all in one place.

It uses **Node.js** with **Fastify** and a **Mysql** database. Tested with **Jest**.

## Usage 

These are the steps you need to follow for using this API:

### The Database
Execute ```npm run reate-db.sh``` to mount a Mysql database. It has two tables,
named _repository_ and _pull_request_, populated with some data.

```
// Database connection

user: root
pwd: root
database: stepsize
host: localhost
port: 33060
```

### The project

Execute ```npm install``` to install all the packages needed.
### The Server

Execute ```npm start``` to start the server. It will be listening on ```http://localhost:3000```.

For convenience, _.env_ file has been added to the repository project.

### Endpoints

All endpoints are secured with a basic non-expiring token. You must declare it on the header as:
```
TOKEN: STEPSIZE
```

Also, there is a **health-check endpoint** to check the availability of the server:
```http://localhost:3000/health```

And a Swagger UI /docs page:
```http://localhost:3000/docs/static/index.html```

### GitHub Repository

To assist with testing, I created a GitHub dummy repository: [repository-1](https://github.com/juliapolbach/repository-1/branches)
### Test and coverage

The project is tested with Jest. You can run it executing ```npm run test```. 
You can also run a test coverage exam with ```npm run test:coverage``` and check the TypeScript coverage with ```npm run type-coverage```.

## Proposal

### The structure

Project directory structure is inspired by **SOLID principles** and **hexagonal architecture**. It pursues an easy-to-understand
folder organization and smooth scalability.

- ```/bin```: Contains the initial file _start.js_
- ```/docker-db```: Contains all that is needed to mount the mysql DB.
- ```/lib```: Contains all the application code.
- ```/test```: Contain all the application test.

In the ```/lib``` folder, code is organized by _core_ functionalities, such as:

- Database connection
- API wrappers
- Helpers
- etc.

and functionality by _entities_, in this case, all use cases relates to _Pull Request_ entity. Inside of this, you'll find:

- ```/application```: with the 3 use cases related to each endpoint.
- ```/domain```: Types and Interfaces
- ```/infrastructure```: Controller, routes, and a repository to define all SQL raw interactions.  

This specific project structure may seem a bit overdue, but if scalability is a goal, brake the
code in hierarchical classes, use interfaces or extract code host providers into wrappers may help when growing. 
That way, adding or deleting a provider it's a safe process that won't (almost nothing) affect previous code.

### The logic

One of the biggest challenge of the task was to determine the sweet spot between fetching data from the Database
(faster, but inconsistent) or directly from the code host provider's API (up-to-date) without polling.

Because _on-demand_ was an imperative condition, I chose to call the APIs when needed to check the last Pull Request's _status_.

But, to smooth things a little and avoid fetching and persisting lots of data in every call, I assumed that _merged_ Status is
a final status, and no relevant changes will occur on that Pull Requests. This way, logic only calls to code host providers APIs
when needed, in an attempt to keep the performance in good shape.


