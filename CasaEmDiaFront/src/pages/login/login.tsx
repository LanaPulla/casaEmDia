import { useState } from 'react';
import "./login.scss";
// import { api } from '../../services/api'; // Importando o serviço

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // O serviço é chamado AQUI, dentro da ação do usuário
//       const response = await api.post('/login', { email, password });
//       console.log("Login feito com sucesso!", response.data);
//       // Aqui você salvaria o token e redirecionaria o usuário
//     } catch (error) {
//       console.error("Erro ao fazer login");
//     }
//   };

  return (
    <div className='background'>
    <form 
      // onSubmit={}
      >
        <div className='d-flex justify-content-center align-items-center gap-5'>

          <div className='d-flex flex-column area-responsavel w-100 pt-5 pb-5 pl-5 pr-5 gap-1'>
            <h4>Testando</h4>
            <label className='gap-0'>Nome de login</label>
            <input className='p-1' type="Email" placeholder='nome de login'//onChange={(e) => setEmail(e.target.value)}
            />
            <label>Senha</label>
            <input className='p-1' type="password" placeholder='senha' //onChange={(e) => setPassword(e.target.value)} 
            />
            <button className='mt-2' type="submit">Entrar</button>
          </div>

          <div className="d-flex justify-content-center align-items-center flex-column logo m-6">
            {/* <img src="login/logo-cm-fundo.png" alt="EduConnect" /> */}
            <h1>Testando</h1>
            <h4>Casa Em Dia</h4>
          </div>

          <div className='d-flex flex-column area-professor w-100 pt-5 pb-5 pl-5 pr-5 gap-1'>
            <h4>Testando</h4>
            <label>Nome de login</label>
            <input className='p-1' type="Email" placeholder='nome de login'//onChange={(e) => setEmail(e.target.value)}
            />
            <label>Senha</label>
            <input className='p-1' type="password" placeholder='senha' //onChange={(e) => setPassword(e.target.value)} 
            />
            <button className='mt-2' type="submit">Entrar</button>
          </div>
         
        </div>
        
      </form>
    </div>
    
  );
}