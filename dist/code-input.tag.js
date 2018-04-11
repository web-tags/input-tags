document.head.insertAdjacentHTML('beforeend', `<template id="code-input"><style>:host{display:inline-block;font-size:0;overflow:hidden;--box-size:40px;--font-size:30px;border-radius:3px}input{position:absolute;left:-1000px}table{width:100%;border-collapse:collapse}td{background:#333;color:white;font-size:var(--font-size);text-align:center;vertical-align:middle;width:10%}.empty{color:silver}.focus{background:#555}[dash]{color:silver;font-style:normal}</style><table><tr><td on-tap="focusDigit"></td><td on-tap="focusDigit"></td><td on-tap="focusDigit"></td><td dash="">&#x2010;</td><td on-tap="focusDigit"></td><td on-tap="focusDigit"></td><td on-tap="focusDigit"></td></tr></table><input type="number" pattern="[0-9]*"></template>`);
window.customElements.define('code-input', class extends HTMLElement {
	constructor() {super();this.attachShadow({mode: 'open'}).appendChild(document.querySelector('template#code-input').content.cloneNode(true));;}
	$(q){return this.shadowRoot.querySelector(q)}
	$$(q){return this.shadowRoot.querySelectorAll(q)}
 	
	connectedCallback(){
		// document.body.addEventListener('keyup',this.input.bind(this));
		this.$('input').addEventListener('keyup',e=>this.input(e));
		this.$('input').addEventListener('blur',()=>this.blur());
		// this.$$('td').forEach(item=>{
		// 	item.addEventListener('click', e=>this.focusDigit(e.target));
		// });
		this.reset();   
	}
	reset(){
		this.$$('td').forEach(item=>{
			if(item.hasAttribute('dash'))return;
			item.innerHTML='&#9679;'
			item.classList.add('empty');
		});
	}
	focus(){
		this.focusDigit(this.$('td')); 
	}
	blur(){
		this.$$('td').forEach(e=>e.classList.remove('focus'));
	}
	focusDigit(node,direction){
		if(!node) return;
		if(node.target) node = node.target;
		this.blur();
		// if(!node) return;
		// if(node.tagName=='I') 
		if(node.hasAttribute('dash')) 
			if(direction=='left') node = node.previousElementSibling;
			else node = node.nextElementSibling;
		node.classList.add('focus');
		this.$('input').focus();
	}
	input(event){
		var node = this.$('.focus');
		if(!node)return;
		if(event.key=='ArrowLeft') return this.focusDigit(node.previousElementSibling,'left');
		if(event.key=='ArrowRight') return this.focusDigit(node.nextElementSibling);
		if(event.key=='Backspace') {
			node.innerHTML = '&#9679;'
			node.classList.add('empty');
			return this.focusDigit(node.previousElementSibling,'left');
		}
		// console.log(event);
		if(![0,1,2,3,4,5,6,7,8,9].includes(event.key*1)) return;
		node.innerHTML = event.key;
		node.classList.remove('empty');
		this.focusDigit(node.nextElementSibling);
		// this.value = this.getValue();
		if(this.$$('.empty').length==0) this.complete();
	}

	// set value(v){
	// 	this.setAttribute('value',this.getValue());
	// }
	get value(){
		return Array.from(this.$$('td')).map(n=>n.innerHTML).join('');
	}
	complete(){
		var code = this.value;
		console.log('CODE',code);
		this.dispatchEvent( new CustomEvent('complete', { detail: code }) );
		// var f = this.getAttribute('on-complete');
		// if(f) eval(f)(code);
		// setTimeout(()=>eval(this.getAttribute('on-complete'))(code),50);
	}

});