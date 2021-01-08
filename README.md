## Express - based API for a Blog App
---
### Documentation
#### Routes handled by the API
- **GET** ```/api/auth/github```
- **GET** ```/api/auth/github/callback```
- **GET** ```/api/auth/fail```
- **GET** ```/api/auth/logout```
- **GET** ```/api/posts``` 
- **GET** ```/api/post/:postId```  
- **GET** ```/api/post/:postId/likes/:pageNumber```  
- **GET** ```/api/post/:postId/comments/:pageNumber```  
- **GET** ```/api/post/:postId/like```  
- **GET** ```/api/post/:postId/unlike```  
- **GET** ```/api/post/:postId/isliked```  
- **GET** ```/api/posts/:pageNumber```  
- **GET** ```/api/:user```  
- **GET** ```/api/:user/posts/:pageNumber```  
- **GET** ```/api/:user/following/:pageNumber```  
- **GET** ```/api/:user/followers/:pageNumber```  
- **GET** ```/api/:user1/following/add/:user2```  
- **GET** ```/api/:user1/following/remove/:user2```  
- **GET** ```/api/:user1/follower/remove/:user2```  
---
- **POST** ```/api/post```  
- **POST** ```/api/:postId/comment```  
---
#### SETUP CONFIGURATION VARIABLES
- ```PORT```
- ```NODE_ENV```
- ```MONGO_URI```
- ```GITHUB_CLIENT_ID```
- ```GITUHUB_CLIENT_SECRET```
- ```SESSION_SECRET```
- ```MORGAN_LOGGING_TYPE_DEV```
- ```MORGAN_LOGGING_TYPE_PROD```
- ```FRONTEND_URI```
- ```LIMITS```