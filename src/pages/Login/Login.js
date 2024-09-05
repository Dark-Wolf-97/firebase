import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../../firebaseConnection";
import { useNavigate } from 'react-router-dom';


function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    function singIn(e){
    e.preventDefault();
    signInWithEmailAndPassword(email,password);
    }

    if (error) {
      }
      if (loading) {
        return <p>Carregando...</p>;
      }
      if (user) {
          navigate("/Home")
      }
    return(
        <div>
            <label>Usuario</label>
            <input type="text" placeholder="usuario" onChange={e =>setEmail(e.target.value)}></input>
            <label>Senha</label>
            <input type="text" placeholder="senha" onChange={e =>setPassword(e.target.value)}></input>
            <button onClick={singIn}>Entrar</button>
            <Link to="/Cadastro">Cadastrar Conta</Link>

        </div>
    );
}

export default Login