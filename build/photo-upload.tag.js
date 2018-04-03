document.head.insertAdjacentHTML('beforeend', `<template id="photo-upload"><style>:host{--size:200px;--color:#ccc;--background:#fff;display:inline-block;width:var(--size);height:var(--size);background:var(--background)}:host([hidden]){display:none}svg{display:block;width:100%;height:100%;fill:var(--color)}circle-spinner{margin-top:10%;width:80%;height:80%}img{width:100%;height:100%;object-fit:cover}.pulse{animation:pulse 2s linear infinite}@keyframes pulse{from{opacity:.9}50%{opacity:.1}to{opacity:.9}}</style><input id="input" type="file" accept=".jpg,.png" hidden><label for="input"><svg id="placeholder" viewbox="0 0 100 100" preserveaspectratio="xMinYMin"><circle cx="50" cy="35" r="25"/><ellipse cx="50" cy="100" rx="45" ry="40"/></svg> <img id="photo" hidden></label></template>`);
			window.customElements.define('photo-upload', class extends HTMLElement {
				constructor() {
					super();
					this.attachShadow({mode: 'open'}).appendChild(document.querySelector('template#photo-upload').content.cloneNode(true));
					
				}
				$(q){return this.shadowRoot.querySelector(q)}
				
			 	
	connectedCallback(){
		this.input = this.$('input');
		this.input.addEventListener('change',this.upload.bind(this));
		this.data = {};
	}
	addData(dict){
		for(var key in dict)
			this.data[key] = dict[key];
	}
	loadImage(src){
		var reader = new FileReader();
		reader.onload = e => this.setImage(e.target.result);
		reader.readAsDataURL(src);	
	}
	setImage(src){
		this.$('img').setAttribute('src',src);
		// this.show('photo');
		this.$('svg').style.display = 'none';		
		this.$('img').hidden = false;
	}
	// show(id){
		// this.shadowRoot.querySelectorAll('label>*').forEach(item=>item.hidden=true);
		// this.$('#'+id).hidden = false;
	// }
	upload(){
		this.$('svg').style.display = 'block';		
		this.$('img').hidden = true;
		// this.show('loading');
		this.$('svg').classList.add('pulse');
		var data = new FormData();
		data.append('photo', this.input.files[0]);
		for(var key in this.data)
			data.append(key, this.data[key]);
		if(this.getAttribute('url'))
			fetch(this.getAttribute('url'), {
				method: 'POST',
				body: data
			}).then(x=>x.json()).then(x=>{
				this.$('svg').classList.remove('pulse');
				console.log('upload result',x);
				if(x.value) this.setAttribute('value',x.value);
				this.dispatchEvent( new CustomEvent('complete', { detail: x }) );
				this.loadImage(this.input.files[0]);
			});
		this.loadImage(this.input.files[0]);
	}

			});