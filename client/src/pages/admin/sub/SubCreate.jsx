import React,{useState,useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
import { getCategories } from '../../../functions/category';
import { createSub,getSubs,removeSub } from '../../../functions/sub';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
const SubCreate=()=>{
    const {user}=useSelector((state)=>({...state}));
    const [name,setName]=useState("");
    const [loading,setLoading]=useState(false);
    const [category,setCategory]=useState("");
    const [categories,setCategories]=useState([]);
    const [subs,setSubs]=useState([]);
    const [keyword,setKeyword]=useState("");
    
    useEffect(()=>{
        loadCategories();
        loadSubs();
    },[]);
    const loadCategories=()=>{
        return (getCategories().then((c)=>setCategories(c.data)));
    }
    const loadSubs=()=>{
        return (getSubs().then((c)=>setSubs(c.data)));
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        // console.log(name);
        setLoading(true);
        createSub({name,parent:category},user.token)
        .then((res)=>{
            setLoading(false);
            setName("");
            toast.success(`${res.data.name} is created.`);
            loadSubs();
            
        })
        .catch((err)=>{
            setLoading(false);
            if (err.response.status===400){
                toast.error(err.response.data);
            }
        });
    };
    const handleRemove=async(slug)=>{
        if (window.confirm("Delete?")){
            setLoading(true);
            removeSub(slug,user.token)
            .then((res)=>{
                setLoading(false);
                toast.error(`${res.data.name} deleted.`);
                loadSubs();
            })
            .catch((err)=>{
                setLoading(false);
                if (err.response.status===400){
                toast.error(err.response.data);
            }
            })
        }
        // console.log(answer,slug);
    };
   
   const searched=(keyword)=>(c)=>c.name.toLowerCase().includes(keyword);
   return (
    <div className='container-fluid'>
        <div className='row'>
            <div className='col-md-2 text-bold'>
                <AdminNav/>
            </div>
            <div className='col-md-8'> 
            {loading?<h4 className='text-danger'>Loading...</h4>:<h4>Create Sub Category</h4>}
            <div className="form-group">
                <label className="h5">Parent Category</label>
                <select name='category' className='form-control' onChange={(e)=>setCategory(e.target.value)}>
                    <option>Please Select</option>
                    {categories.length>0 && categories.map((c)=>(
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>
            
            <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName}/>
            <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
            

            {subs.filter(searched(keyword)).map((s)=>{
                return (<div className='alert alert-primary' key={s._id}>
                    {s.name}{" "}<span onClick={()=>handleRemove(s.slug)} className='btn btn-sm float-end mx-2'><DeleteOutlined className='text-danger'/></span><Link to={`/admin/sub/${s.slug}`}><span className='btn btn-sm float-end'><EditOutlined className='text-warning'/></span></Link>
                </div>)
            })}

            </div>
        </div>
    </div>);

};
export default SubCreate;