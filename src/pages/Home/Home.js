import React,{useState,useEffect} from "react";
import { db } from "../../firebaseConnection";
import { doc,collection,addDoc,deleteDoc,updateDoc,getDocs,onSnapshot } from "firebase/firestore";

function Home(){
    const [tarefa, setTarefa] = useState();
    const [idTarefa, setIdTarefa] = useState();

    useEffect(()=>{
        async function carregarTarefa(){
            const dados = onSnapshot(collection(db,"tarefas"),(snap)=>{
                let listaTarefas = [];

                snap.forEach((doc)=>{
                    listaTarefas.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa
                    });
                });
                setTarefa(listaTarefas);
            });
        }
        carregarTarefa();
    },[]);

    async function adicionarTarefa(){
        await addDoc(collection(db,"tarefas"),{
            tarefa: tarefa
        }).then(()=>{
            setTarefa("");
        }).catch((erro)=>{
            console.log("Erro "+erro)
        });
    }

    async function buscarTarefa(){
        await getDocs(collection(db,"tarefas"))
        .then(
            (snap)=>{
                let listaTarefa = [];
                snap.forEach((doc)=>{
                    listaTarefa.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa
                    })
                })
                setTarefa(listaTarefa);
            }
        ).catch((erro)=>{
            console.log("Erro " + erro);
        });
    }

    async function editarTarefa(){
        const tarefaEditada = doc(db,"tarefas",idTarefa);

        await updateDoc(tarefaEditada,{
            tarefa: tarefa
        }).then(()=>{
            setIdTarefa("");
            setTarefa("");
        }).catch((erro)=>{
            console.log("Erro " + erro);
        });
    }

    async function deletarTarefa(id){
        const tarefaDeletada= doc(db,"tarefas",id);
        
        await deleteDoc(tarefaDeletada)
        .then(()=>{
            alert("Tarefa Deletada");
        }).catch((erro)=>{
            console.log("Erro " + erro);
        });
    }

    //console.log(tarefa)

    return(
        <div>
            <h2>Lista de Tarefas</h2>

            <label>Id Tarefa</label>
            <input type="text"  placeholder="Id da Tarefa" value={idTarefa} onChange={(e)=>setIdTarefa(e.target.value)}/>
            <label>Tarefa</label>
            <input type="text" placeholder="Tarefa" value={tarefa} onChange={(e)=>setTarefa(e.target.value)}/>
            <button onClick={adicionarTarefa}>Adicionar</button>
            <button onClick={buscarTarefa}>Buscar</button>
            <button onClick={editarTarefa}>Editar</button>

           {/* <ul>
                {tarefa.map((item)=>{
                    return(
                        <li key={item.id}>
                            <strong>ID: {item.id}</strong>
                            <strong>Tarefa: {item.tarefa}</strong>
                            <button onClick={()=> deletarTarefa(item.id)}>Excluir</button>
                        </li>
                    )
                })}
            </ul>*/}
        </div>
    )

}

export default Home;