const { Schema, mongoose } = require("mongoose");

const likeSechema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    
  },
  { timestamps: true },
);

const like = mongoose.models.likes || mongoose.models("Like", likeSechema);
target id what sense this
like uske liye to post schema link h na or kisne like kiya uske 
liy userid   kahaa like hua hai vo 
kispe like kahaa like hua hai

what you thing 
i apologise then next make model wait for complete my txt
means if i wrong then tell me
 no buddy if i wrong you told me this is the right or wrong
 what are u saying 
 ek kaam karoo tum mujhe samjhao ki like handle kese 
 honge kispe like hua hai comment par ya post par
 i offcpurse 
 first comment pe aate h apno ne comment ko post se link 
 kar rakha then kisi post par comment hua 
 ab comment pr bhi users like karte h 
 so apno ne comment model me like model ko bhi link kar
 jaise hi kisi user ne comment ko like kiya then 
 like model me jo fiel
done
aagya smj me srr
 to ab isme like me commet ko bhi link karna padega kya
 no like me comment ki require nhi bcz like only like 
 ok comment me like ko jo already ho chuka hai
  yes srr ok done

  ab kiska banana hai model
  follower ka banaa rahaa hu sr
  checked what cheaked
  
  diagram checked srr 
  okk created message model 
  and chat modeldcc
  one problem followers model work keese karega can you 
  explain me
  target userId 
  followe flase/true
  so i think aon eesa nhi kar skte jaise user model
   me isFollowed fields rakhe or usme ref userId
  rakhe jaise kisi user ne follow kiya vo true
   ho jaye or us user
  ki id usme aajaye what u think pls tell me 
  i creating followers model ok what happend

  listion follower  = ref user ,userid
  also same for following
  no bcz user on particular then another user 
  follow  samjh nhi aaaya
  this user so stored another 
  
  okk i explain 
  jaise me ek user hu mere model me bolo sr
  wait sceneio understand 

  jese ek user hai userid1
  dusra user hia userid2
   
 it store like this
  user1 follow userid2
vo hi to frontend bhi to hai sr a
gneral llortnoc es dnekcab lluf 
  i explain jaise apn condition rakhenge frontend me 
  means jaise koi  user me login hu or another user mere 
  suggestion me aaya then usne check kiya ye mere isFollowed me h ya nhi 
  nhi to follow btn if h to following  what happen srr
  where srr