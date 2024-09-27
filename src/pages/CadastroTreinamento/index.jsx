import './style.css'

function CadastroTreinamento() {
  return (

    <div className='container'>
      <form action="">
        <h1>Cadastro De Novo Curso</h1>
        <input name="titulo" type='text' placeholder='Dê um título' />
        <input name="descrição" type='text' placeholder='Descrição do curso' />
        <input name="vencimento" type='date' placeholder='Data de vencimento' />
        <input name="anexo" type='file' />
        <button type='button'>Cadastrar</button>
      </form>

    </div>

  )
}

export default CadastroTreinamento
