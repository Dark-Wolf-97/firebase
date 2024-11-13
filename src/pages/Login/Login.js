import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../../firebaseConnection";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [toastErro, setToastErro] = useState(false);
  const [toastLoading, setToastLoading] = useState(false);

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  function singIn(e) {
    e.preventDefault();
    setToastErro(false);
    setToastLoading(false);
    signInWithEmailAndPassword(email, password);
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

  if (user) {
    navigate("/Perfil");
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Faça login na sua conta</h2>
        <label>Usuário</label>
        <input type="text" placeholder="exemplo@tigrinho.com" onChange={e => setEmail(e.target.value)} />
        <label>Senha</label>
        <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
        <button onClick={singIn}>Entrar</button>
        <Link to="/Cadastro">Crie uma nova conta</Link>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
