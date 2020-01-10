
(() => {
    const Vector = class {
        static create(x, y){
            return new Vector(x, y);
        }
        constructor(x = 1, y = 0){
            this._x = x;
            this._y = y;
        }
        set x(value){
            this._x = value;
        }
        set y(value){
            this._y = value;
        }
        get x(){
            return this._x;
        }
        get y(){
            return this._y;
        }
        getInfo(
            ){
            return {_x:this._x, _y:this._y}
        }
        setAngle(angle){
            const length = this.getLength();
            this._x = Math.cos(angle) * length;
            this._y = Math.sin(angle) * length;
        } 
        getAngle(){
            return Math.atan2(this._y, this._x);
        }
        setLength(length){
            const angle = this.getAngle();
            this._x = Math.cos(angle) * length;
            this._y = Math.sin(angle) * length;
        }
        getLength(){
            return Math.sqrt(this._x * this._x + this._y * this._y);
        }
        add(vector2){
            if(!(vector2 instanceof Vector)) throw 'pram is not vector!';
            return Vector.create(this._x + vector2.x, this._y + vector2.y);
        }
        subtract(vector2){
            if(!(vector2 instanceof Vector)) throw 'pram is not vector!';
            return Vector.create(this._x - vector2.x, this._y - vector2.y);
        }
        multiply(value){
            return Vector.create(this._x * value, this._y * value);
        }
        divide(value) {
            return Vector.create(this._x / value, this._y / value);
        }
        addTo(vector2) {
            this._x += vector2.x;
            this._y += vector2.y;
        }
        subtractFrom(vector2) {
            this._x -= vector2.x;
            this._y -= vector2.y;
        }
        multiplyBy(value) {
            this._x *= value;
            this._y *= value;
        }
        divideBy(value) {
            this._x /= value;
            this._y /= value;
        }
    }
    const Particle = class {
        static create(x, y, speed, direction){
            return new Particle(x, y, speed, direction);
        }
        constructor(x, y, speed, direction){
            this._position = Vector.create(x, y);
            this._velocity = Vector.create(0, 0);
            this._velocity.setLength(speed);
            this._velocity.setAngle(direction);
        }
        update(){
            this._position.addTo(this._velocity);
        }
    }
    //util
    const getEl = tag => document.getElementById(tag);
    const printError = e => {if(isDebug){throw e;} else {console.log(e);}}
    const makeProp = (target, ...p) => Object.assign(target,...p);

    //----------------------static code----------------------
    const makeCircle = (radius,angle,numObjects,x,y) => (
        {radius,angle,numObjects,slice: Math.PI * 2 /numObjects,x,y}
    )
    const makeGreenRain = () => ({})
    const makeLissajous = (xRadius,yRadius,xAngle,yAngle,xSpeed,ySpeed,x,y) => (
        {xRadius,yRadius,xAngle,yAngle,xSpeed,ySpeed,x,y}
    )
    const widthHeightMaker = () => ({ width: getEl('canvas').width, height: getEl('canvas').height })
    const makePaticle = (numParticles = 100, f = widthHeightMaker) =>{ 
        const particles = [];
        const {width, height} = f();
        for(let i = 0; i < numParticles; i += 1){
            particles.push(Particle.create(width / 2, height / 2, Math.random() * 4 + 1,
            Math.random() * Math.PI * 2));
        }
        return {particles, numParticles}
    }

    const Model = class {
        constructor(func, ...arg){
            const result = func(...arg);
            makeProp(this, result);
        }
    }

    const Render = class {
        constructor(dom){
            this.canvas = getEl(dom);
            this.context = this.canvas.getContext('2d');
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
        }
        render(model){
            if(!(model instanceof Model)) printError('The render`s parameter is not a Model!');
            makeProp(this,{...model});
            requestAnimationFrame(this._render.bind(this));
        }
        _render(){
            printError('must be ovprintErrorided!');
        }
    }

    const UpdateRender = class extends Render{
        constructor(dom){
            super(dom);
        }
        _render(){
            this.context.clearRect(0, 0, this.width, this.height);
            for(let i = 0; i < this.numParticles; i += 1) {
                const particle = this.particles[i];
                particle.update();
                this.context.beginPath();
                this.context.arc(p._position.x, p._position.y, 10 , 0, Math.PI * 2, false);
                this.context.fill();
            }
            requestAnimationFrame(this._render.bind(this));
        }
    }

    const CircleRender = class extends Render {
        constructor(dom){
            super(dom);
            this.centerY = this.height / 2;
            this.centerX = this.width / 2;
        };
        _render(){
            for(let i = 0; i < this.numObjects; i += 1){
                this.angle = i * this.slice;
                this.x = this.centerX + Math.cos(this.angle) * this.radius;
                this.y = this.centerY + Math.sin(this.angle) * this.radius;
                this.context.beginPath();
                this.context.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
                this.context.fill();
            }
            requestAnimationFrame(this._render.bind(this));
        }
    }

    const GreenRainRender = class extends Render {
        constructor(dom){
            super(dom);
            this.xres = 10;
            this.yres = 11;
        }
        _render(){
            this.context.fillStyle = "black";
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.fillStyle = "green";
            this.context.font = "12px Courier";
            this.context.translate(this.width / 2, this.height / 2);	
            this.context.transform(1.5, .3, 0.1, 1.5, 0, 0);       
            for(var y = -this.height / 2; y < this.height / 2; y += this.yres) {
                for(var x = -this.width / 2; x < this.width / 2; x += this.xres) {
                    var char = Math.random() < .5 ? "0" : "1";
                    this.context.fillText(char, x, y);
                }
            }
            requestAnimationFrame(this._render.bind(this));
        }
    }

    const LissajousRender = class extends Render {
        constructor(dom){
            super(dom);
            this.centerY = this.height * .5;
            this.centerX = this.width * .5;
        };
        _render(){
            this.context.clearRect(0, 0, this.width, this.height);
            const x = this.centerX + Math.cos(this.xAngle) * this.xRadius;
            const y = this.centerY + Math.sin(this.yAngle) * this.yRadius;
            this.context.beginPath();
            this.context.arc(x, y, 10, 0, Math.PI * 2, false);
            this.context.fill();
            this.xAngle += this.xSpeed;
            this.yAngle += this.ySpeed;
            requestAnimationFrame(this._render.bind(this));
        }
    }

    //----------------------host code----------------------

    //1
    const render = new GreenRainRender('canvas');
    const model = new Model(makeGreenRain);
    render.render(model);

    //2
    // const render2 = new LissajousRender('canvas');
    // const model2 = new Model(makeLissajous, 400, 400, 0, 0, 0.1, 0.131);
    // render2.render(model2);
       
    //3
    // const render3 = new CircleRender('canvas');
    // const model3 = new Model(makeCircle, 200, 0, 10)
    // render3.render(model3);

    //4
    // const render4 = new UpdateRender('canvas');
    // const model4 = new Model(makePaticle, 100);
    // render4.render(model4);
})(isDebug = true);