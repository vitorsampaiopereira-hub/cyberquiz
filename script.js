// Array de objetos: cada objeto representa uma pergunta.
const perguntas = [
 {texto:'O que é phishing?',opcoes:['Um golpe para roubar informações','Um tipo de backup','Uma atualização do sistema'],correta:0,explicacao:'Phishing usa mensagens enganosas para obter informações.'},
 {texto:'Qual senha é mais segura?',opcoes:['123456','Uma senha longa, única e aleatória','Seu nome e aniversário'],correta:1,explicacao:'Senhas longas e únicas dificultam ataques.'},
 {texto:'Para que serve a autenticação em dois fatores?',opcoes:['Desativar o antivírus','Aumentar a velocidade da internet','Adicionar uma etapa de verificação'],correta:2,explicacao:'Um segundo fator ajuda a proteger sua conta.'},
 {texto:'O que fazer ao receber um link suspeito?',opcoes:['Verificar a origem antes de abrir','Abrir imediatamente','Enviar para todos os contatos'],correta:0,explicacao:'Verifique o remetente e o endereço por um canal confiável.'},
 {texto:'Qual é a finalidade de um backup?',opcoes:['Apagar arquivos','Recuperar dados perdidos','Compartilhar senhas'],correta:1,explicacao:'Backups permitem recuperar informações em caso de perda.'}
];
let indice = 0, pontos = 0, respondida = false, recorde = 0;
try { recorde = Number(localStorage.getItem('cyberquiz-recorde')) || 0; } catch (erro) { console.warn('Armazenamento indisponível.'); }
const $ = id => document.getElementById(id);
const form = $('form');
function mostrarPergunta(){
 respondida = false;
 const atual = perguntas[indice];
 $('progresso').textContent = `Pergunta ${indice+1} de ${perguntas.length}`;
 $('recorde').textContent = `Recorde: ${recorde}/${perguntas.length}`;
 $('preenchimento').style.width = `${indice/perguntas.length*100}%`;
 $('pergunta').textContent = atual.texto;
 $('opcoes').replaceChildren();
 const legenda = document.createElement('legend'); legenda.textContent='Selecione uma resposta'; $('opcoes').append(legenda);
 // Laço: cria uma opção para cada elemento do array.
 for(let i=0;i<atual.opcoes.length;i++){
  const label = document.createElement('label');
  const input = document.createElement('input'); input.type='radio'; input.name='resposta'; input.value=i;
  label.append(input, document.createTextNode(atual.opcoes[i])); $('opcoes').append(label);
 }
 $('mensagem').textContent=''; $('mensagem').className='';
 form.hidden=false; $('confirmar').disabled=false; $('proxima').hidden=true; $('reiniciar').hidden=true;
}
form.addEventListener('submit', evento=>{
 evento.preventDefault();
 if(respondida) return;
 const escolhida = form.querySelector('input:checked');
 if(!escolhida){ $('mensagem').textContent='Selecione uma alternativa antes de confirmar.'; $('mensagem').className='erro'; return; }
 respondida=true;
 const atual=perguntas[indice];
 // Condicional: compara a resposta escolhida com a correta.
 if(Number(escolhida.value)===atual.correta){ pontos++; $('mensagem').textContent='Correto! '+atual.explicacao; $('mensagem').className='sucesso'; }
 else { $('mensagem').textContent='Incorreto. '+atual.explicacao; $('mensagem').className='erro'; }
 for(const input of form.querySelectorAll('input')) input.disabled=true;
 $('confirmar').disabled=true; $('proxima').hidden=false;
 $('proxima').textContent=indice===perguntas.length-1?'Ver resultado':'Próxima pergunta';
 $('preenchimento').style.width=`${(indice+1)/perguntas.length*100}%`;
});
$('proxima').addEventListener('click',()=>{ indice++; if(indice<perguntas.length) mostrarPergunta(); else finalizar(); });
function finalizar(){
 if(pontos>recorde){ recorde=pontos; try{localStorage.setItem('cyberquiz-recorde',String(recorde));}catch(erro){console.warn('Não foi possível salvar o recorde.');} }
 $('recorde').textContent=`Recorde: ${recorde}/${perguntas.length}`;
 $('progresso').textContent='Quiz concluído'; $('pergunta').textContent=`Você acertou ${pontos} de ${perguntas.length}!`;
 $('mensagem').textContent=pontos>=3?'Muito bem! Continue aprendendo.':'Revise as dicas e tente novamente.'; $('mensagem').className='';
 form.hidden=true; $('proxima').hidden=true; $('reiniciar').hidden=false;
}
$('reiniciar').addEventListener('click',()=>{indice=0;pontos=0;mostrarPergunta();});
mostrarPergunta();
