import React,{useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../../firebaseConnection";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Cadastro.css"

function Cadastro(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toastErro, setToastErro] = useState(false);
    const [toastLoading, setToastLoading] = useState(false);

    const [
      createUserWithEmailAndPassword,
      user,
      loading,
      error,
    ] = useCreateUserWithEmailAndPassword(auth);

    function singUp(e){
        e.preventDefault();
        setToastErro(false);
        setToastLoading(false);
        createUserWithEmailAndPassword(email,password);
    }
    useEffect(() => {
        if (error && !toastErro) {
          toast.error("Erro: usuário ou senha inválidos!",{
            autoClose:2000
          });
          setToastErro(true);
        }
      }, [error, toastErro]);

    useEffect(() => {
        if (loading && !toastLoading) {
          toast.info("Carregando...",{
            autoClose:500
          });
          setToastLoading(true);
        }
      }, [loading, toastLoading]);
    
    if (user){
        navigate("/Perfil");
    }

    return(
        <div className="container">
            <div className="form">
            <h2>Criar uma nova conta</h2>
            <label>Usuário</label>
            <input type="text" placeholder="exemplo@tigrinho.com" onChange={e => setEmail(e.target.value)} />
            <label>Senha</label>
            <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
            <button onClick={singUp}>Entrar</button>
            <Link to="/">Já Possui Conta</Link>
            </div>
            <ToastContainer/>
      </div>
    )
}

export default Cadastro