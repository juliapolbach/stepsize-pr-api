# **Stepsize Pull Requests API**

This project is a code proposal for **Stepsize Backend take-home task**. 
An API that integrates with any code hosting provider and allows users to track and merge pull requests, all in one place.

It uses **Node.js** with **Fastify** and a **Mysql** database. Tested with **Jest**.

## Usage 

These are the steps you need to follow for using this API:

### The Database
Execute ```npm run create-db``` to mount a Mysql database. It has two tables,
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

Configuration of a _.env_ file is needed. Please use _.env.sample_ as a reference.

Execute ```npm start``` to start the server. It will be listening on ```http://localhost:3000```.

### Endpoints

All endpoints are secured with a basic non-expiring token. You must declare it on the header as:
```
TOKEN: STEPSIZE
```

- #### Health-check
  There is a **health-check endpoint** to check the availability of the server.

  endpoint : ```http://localhost:3000/health```

- #### Fetch all PR's by Repository name
  endpoint : ```http://localhost:3000/api/pullrequest?repositoryName=repository-1```
  ```
  // response example
  
  {
  "statusCode": 200,
  "data": [
    {
      "id": 1,
      "codeHostingProvider": "github",
      "repository": {
        "name": "repository-1"
      },
      "title": "Add info to README.md",
      "description": "Add some useful info to the Readme.",
      "isMergeable": false,
      "createdAt": "2022-08-15T16:32:55.000Z",
      "status": "merged"
    },
  ...
  ```
- #### Track a pull request
  endpoint : ```http://localhost:3000/api/pullrequest```
  ```
  // Body example
  
  {
     "repositoryName": "repository-1",
     "pullRequestNumber": 3,
     "codeHostingProvider": "github"
  }
  ```
    ```
    // response example
  
    {
  "statusCode": 200,
  "data": {
      "id": 3,
      "codeHostingProvider": "github",
      "repository": {
         "name": "repository-1"
       },
      "title": "Fix endpoint status response",
      "description": null',
      "isMergeable": false,
      "status": "closed",
      "createdAt": "2022-08-16T16:12:17Z"
  }
  ```
- #### Fetch all PR's by Repository name
  endpoint : ```http://localhost:3000/api/pullrequest/repository-1/5/merge```
  ```
  // response example
  
  {
  "statusCode": 200,
  "data": {
      "id": 5,
      "codeHostingProvider": "github",
      "repository": {
        "name": "repository-1"
      },
      "title": "Add new cool feature",
      "description": "Add some new cool code.",
      "isMergeable": false,
      "createdAt": "2022-08-16T22:03:33.000Z",
      "status": "merged"
    }
  ```


### GitHub Repository

To assist with testing, I created a GitHub dummy repository: [repository-1](https://github.com/juliapolbach/repository-1)
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

or organized by _entities_, in this case, the _Pull Request_ entity. Inside of its folder, you'll find:

- ```/application```: with three use cases related to each required endpoint.
- ```/domain```: Types and Interfaces.
- ```/infrastructure```: Controller, routes, and a repository to define all SQL raw interactions.  

This specific project structure may seem a bit overdue, but if **scalability is a goal**, braking the
code in hierarchical classes, using interfaces, or extracting code host providers into wrappers may help when growing. 
That way, adding or deleting a provider will be a safe process that won't (almost nothing) affect previous code.

### The logic

One of the **biggest challenges** of the task was to determine the sweet spot between fetching data from the Database
(faster, but inconsistent) or directly from the code host provider's API (up-to-date) without polling.

Because _on-demand_ was an imperative condition, I chose to call the APIs when needed to check the last Pull Request's _status_.

But, to smooth things a little and avoid fetching and persisting lots of data in every call, I assumed that **_merged_ Status is
_final_ status**, and no relevant changes will occur on that Pull Requests. This way, logic only calls to code host providers' APIs
when needed, in an attempt to keep the performance in good shape.


