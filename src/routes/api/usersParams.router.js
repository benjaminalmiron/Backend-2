import RouterClass from "./params.router.js";

class userRouter extends RouterClass {
  init(){
   this.get("/", ["ADMIN"], (req, res) => {
    
    try {
      
      res.sendSuccess([]);
    } catch (error) { 
      res.sendError( error);
    }
  })
}
}

export default userRouter;