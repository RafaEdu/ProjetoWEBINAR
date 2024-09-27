import './style.css'

function CadastroTreinamento() {
  return (

    <div className='container'>
      <form action="">
        <h1>Cadastro De Novo Curso</h1>
        <input name="titulo" type='text' />
        <input name="descrição" type='text' />
        <input name="vencimento" type='date' />
        <input name="anexo" type='file' />
      </form>
    </div>

  )
}

export default CadastroTreinamento
