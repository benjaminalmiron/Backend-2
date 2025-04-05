import { Router } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../../utils/Token.js";


class RouterClass {
  constructor() {
    this.router = Router();
    this.init();
  }

  returnRouter() {
    return this.router;
  }

  init(){}
  
  applycallback(callback){  
    return callback.map(cb => async (...params)=>{
      try {
        await cb.apply(this,params);

      } catch (error) {
        console.error(error);
        params[1].status(500).send("An error ocurred while processing the request");
      }
    }); 
  }

  genCustomResponse = (req, res, next)=>{
   res.sendSuccess = payload => res.status(200).send(payload);
   
   res.sendError = payload => res.status(500).send(payload);
     
    res.sendNotFound = payload => res.status(404).send(payload);
   
    next();
  }

  handlePolicies = policies => (req, res, next) => {
    
      if(policies[0] === "PUBLIC") return next();
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("Unauthorized");
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).send("Unauthorized");
    let user = jwt.verify(token, secretKey);
    if (!user) return res.status(401).send("Unauthorized");
    if(!policies.includes(user.role.toUpperCase())) return res.status(403).send("Forbidden");
    req.user = user;
    next();
  }


  get(path,  policies ,...callback) {
    this.router.get(path, this.handlePolicies(policies) ,  this.genCustomResponse ,this.applycallback(callback));
  }
  post(path, policies, ...callback) {
    this.router.post(path, this.handlePolicies(policies) , this.genCustomResponse ,this.applycallback(callback));
  }

  put(path, policies ,...callback) {
    this.router.put(path, this.handlePolicies(policies) , policies,this.genCustomResponse ,this.applycallback(callback));
  } 

  delete(path, policies,...callback) {
    this.router.delete(path,this.handlePolicies(policies) , this.genCustomResponse ,this.applycallback(callback));
  }

  
  
}

export default RouterClass;