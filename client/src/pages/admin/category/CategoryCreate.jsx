import React,{useState,useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';
import { createCategory,getCategories,removeCategory } from '../../../functions/category';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
const CategoryCreate=()=>{
    const {user}=useSelector((state)=>({...state}));
    const [name,setName]=useState("");
    const [loading,setLoading]=useState(false);
    const [categories,setCategories]=useState([]);
    const [keyword,setKeyword]=useState("");
    
    useEffect(()=>{
        loadCategories();
    },[]);
    const loadCategories=()=>{
        return (getCategories().then((c)=>setCategories(c.data)));
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        // console.log(name);
        setLoading(true);
        createCategory({name},user.token)
        .then((res)=>{
            setLoading(false);
            setName("");
            toast.success(`"${res.data.name}" is created.`);
            loadCategories();
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
            removeCategory(slug,user.token)
            .then((res)=>{
                setLoading(false);
                toast.error(`${res.data.name} deleted.`);
                loadCategories();
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
            {loading?<h4 className='text-danger'>Loading...</h4>:<h4>Create Category</h4>}
            <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName}/>
            <LocalSearch keyword={keyword} setKeyword={setKeyword}/>
            

            {categories.filter(searched(keyword)).map((c)=>{
                return (<div className='alert alert-primary' key={c._id}>
                    {c.name}{" "}<span onClick={()=>handleRemove(c.slug)} className='btn btn-sm float-end mx-2'><DeleteOutlined className='text-danger'/></span><Link to={`/admin/category/${c.slug}`}><span className='btn btn-sm float-end'><EditOutlined className='text-warning'/></span></Link>
                </div>)
            })}
            </div>
        </div>
    </div>);

};
export default CategoryCreate;