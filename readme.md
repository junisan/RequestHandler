# Request Handler (Webhook Handler)    
    
Many times I have not been able to test requests for external services because I was testing my code on a local machine. Request Handler allows you to "capture" a request from an external service (such as a webhook) and analyze the information that the provider sends. You can then forward that request with cUrl on the local computer.    
At the moment, it is only fully compatible with APIs that send data in JSON format.    
> This project comes with ABSOLUTELY NO WARRANTY. The author is not responsible for any malfunction, security breaches or other problems resulting from the use of this tool.    
## Installation
You need to install all project dependencies    
```
npm install
``` 
When installed, configure the.env file    
* PORT: The port through which the application will listen. If you configure Nginx as a reverse proxy, this port will be the internal port in localhost.    
* MONGOURI: The URL by which you connect to a MongoDB database    
* SESSION_SECRET: a random alphanumeric key that will encrypt user sessions    
* API_PATH: The URL to the root of the project (not including the internal routing of the project)    
> **Note:** The project is not ready to be installed in a subdirectory, so it is preferable to change the connection port rather than the path.    
 ## Execute
 Start the NodeJS server with the command    
``` 
npm start
 ``` 
If you are going to use it as a regular server, you should leave control of the process to [PM2](http://pm2.keymetrics.io)    
    
## Create an admin user
Connect to the Mongo database and create a collection **users**. Then insert this document:    
```
{    
	"admin" : true,
	"name" : "myname",
	"passwd" : "$2a$10$EeZBc8wRVHI59umNqGzV..YeX/FHnvlyXqzZS4OnlrIO8eNzoY7I6", 
	"email" : "*myemail@mydomain.com*", 
	"ap" : "7ddf32e17a6ac5ce04a8ecbf782ca509"
}
 ```
 Replace myname with your own name and do the same with your email. In this case, passwd is **DummyTest** encrypted with bcrypt with 10 iterations. You can use any bcrypt encryption that allows to use iterations, like [Daily Cred](https://www.dailycred.com/article/bcrypt-calculator). On the other hand, the ap is the access point where APIs should be called in order to know to which user to link the request. In this case it is'random' encrypted in MD5. You can use any MD5 Encrypter, like [md5.cz](http://www.md5.cz)    
    
Once you log in, you can change your password and email address as many times as you like. However, the name and ap cannot be changed.    
    
## First request for a Webhook
Configure the webhook to send the request to https://yourdomain/api/xxxxxxxxx, where xxxxxxxxx is your ap (each user has a different ap). When the webhook sends the request, NodeJS will detect the body and its headers and you will see it in the main panel.    
From this panel you will be able to see the body, headers and the cUrl command to be runned on your machine. From here you can also change your password.
