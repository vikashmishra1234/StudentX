import React, { useEffect, useState } from "react";
import { deleteFiles, getUploadedFiles } from "../services/Api";
import "./style.css";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { MdBlock } from "react-icons/md";
import Cookies from 'js-cookie'
import { Link, useNavigate } from "react-router-dom";

const Activity = () => {
  const [files, setFiles] = useState("");
  const [userName,setName] = useState('');
  const Navigate = useNavigate();
  const getData = async () => {
      
    const data = await getUploadedFiles();
    if(data){
      console.log(data)
      setName(data.user.data.userName)
      setFiles(data.uploadedFiles);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(()=>{
    const token = Cookies.get("tokenStudentX");
    if(!token){
        Navigate('/auth');
    }
  },[])
  const handleDelete = async (Id) => {
    
     const res = await deleteFiles(Id);
     if(!res){
        toast.error("something went wrong");
        return;
     }
      toast.success('File deleted successfully');
      getData()

    
  };
  const handleLogout = ()=>{
         Cookies.remove("tokenStudentX");
         Navigate('/auth');
  }
  return (
    <section className="activity-section">
      <div>
        <div>
          <img src="/src/assets/men.jpg" alt="" />
          <div>
            <div>{userName}</div>
            <div>
              {" "}
              <small>FilesUploaded: {files&&files.length}</small>
            </div>
          </div>
        </div>
        <div className="button-profile">
          <button onClick={handleLogout}>LogOut</button>
        </div>
      </div>
      {
        files&&files.length>0?<h2 className="activity-heading">you shared the following files.</h2>
        &&files.map(file=>(
            <div key={file._id} className="activity-data">
            <img
              className="icon"
              src="https://cdn-icons-png.flaticon.com/512/887/887997.png"
              alt=""
            />
    
            <div className="subjectName">{file.subjectName}
                <small>{file.code}</small>
            </div>
            <div>
              <MdDelete cursor={'pointer'} onClick={()=>handleDelete(file._id)} size={30} />
            </div>
          </div>
        )):<div className="not-found">
<MdBlock/>
    <small >you hav'nt upload any file. <Link to={'/add/notes'}>upload</Link> </small>
        </div>
      }
    </section>
  );
};

export default Activity;
