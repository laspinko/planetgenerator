var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var canvas = document.getElementById("canvas-id");
canvas.width = 700;
canvas.height = 600;
var ctx = canvas.getContext("2d");
function planet_model(ampl,type,size,seed){
    this.dx=[];this.dy=[];this.dz=[];this.terrain=[];this.size=size;
    this.ampl=ampl;this.radius=100;
    var topPolus=rand(1),botPolus=rand(1),quality=this.size-1;
    if(seed!=undefined){
        topPolus=seed[0][0];
        botPolus=seed[seed.length-1][0];
    }
    for(var i=0;i<this.size;i++){
        this.terrain[i]=[];
        this.terrain[i][0]=topPolus;
        this.terrain[i][this.size-1]=botPolus;
    }
    if(seed!=undefined){
        console.log(this.terrain);
        quality=(this.size-1)/(seed.length-1);
        console.log(quality);
        for(var x=0;x<seed.length;x++){
            for(var y=0;y<seed.length;y++){
                this.terrain[x*quality][y*quality]=seed[x][y];
                //console.log();
            }
        }
    }
    for(var i=quality;i>=2;i/=2){
        for(var x=0;x<this.size-1;x+=i){
            for(var y=0;y<this.size-1;y+=i){
                this.terrain[x+i/2][y+i/2]=
                (this.terrain[x][y]+this.terrain[x+i][y]+this.terrain[x][y+i]+this.terrain[x+i][y+i])/4+rand(i/this.size);
                //if(seed!=undefined)this.terrain[x+i/2][y+i/2]=Math.round(this.terrain[x+i/2][y+i/2]*16)/16;

                this.terrain[x+i/2][y]=(this.terrain[x][y]+this.terrain[x+i][y])/2+(y==0?0:rand(i/this.size));
                //if(seed!=undefined)this.terrain[x+i/2][y]=Math.round(this.terrain[x+i/2][y+i/2]*16)/16;
                this.terrain[x+i/2][y+i]=(this.terrain[x][y+i]+this.terrain[x+i][y+i])/2+(y+i==this.size-1?0:rand(i/this.size));
                //if(seed!=undefined)this.terrain[x+i/2][y+i]=Math.round(this.terrain[x+i/2][y+i/2]*16)/16;
                this.terrain[x][y+i/2]=(this.terrain[x][y]+this.terrain[x][y+i])/2+rand(i/this.size);
                //if(seed!=undefined)this.terrain[x][y+i/2]=Math.round(this.terrain[x+i/2][y+i/2]*16)/16;
                this.terrain[x+i][y+i/2]=(this.terrain[x+i][y]+this.terrain[x+i][y+i])/2+rand(i/this.size);
                //if(seed!=undefined)this.terrain[x+i][y+i/2]=Math.round(this.terrain[x+i/2][y+i/2]*16)/16;
                if(x+i==this.size-1)    this.terrain[0][y+i/2]=this.terrain[x+i][y+i/2];
            }
        }
    }
    for(var x=0;x<this.size;x++){
        for(var y=0;y<this.size;y++){
            var dis=(this.radius+(type && this.terrain[y][x]*ampl<0?0:this.terrain[y][x]*ampl));
            this.dx[x*this.size+y]=Math.sin(y/(this.size-1)*Math.PI*2)*Math.sin(x/(this.size-1)*Math.PI)*dis;
            this.dy[x*this.size+y]=Math.cos(x/(this.size-1)*Math.PI)*dis;
            this.dz[x*this.size+y]=Math.cos(y/(this.size-1)*Math.PI*2)*Math.sin(x/(this.size-1)*Math.PI)*dis;
        }
    }
    this.ox=new Array(this.dx.length);this.oy=new Array(this.dy.length);this.oz=new Array(this.dz.length);
    var i=this.dx.length;
    while(i--){
        this.ox[i]=this.dx[i];
        this.oy[i]=this.dy[i];
        this.oz[i]=this.dz[i];
    }
    console.log("genereted");
    return this;
}
function change_amplitude(pl,ampl,type){
    pl.ampl=ampl;
    for(var x=0;x<planet.size;x++){
        for(var y=0;y<planet.size;y++){
            var dis=(planet.radius+(type && planet.terrain[y][x]*ampl<0?0:planet.terrain[y][x]*ampl));
            planet.dx[x*planet.size+y]=Math.sin(y/(planet.size-1)*Math.PI*2)*Math.sin(x/(planet.size-1)*Math.PI)*dis;
            planet.dy[x*planet.size+y]=Math.cos(x/(planet.size-1)*Math.PI)*dis;
            planet.dz[x*planet.size+y]=Math.cos(y/(planet.size-1)*Math.PI*2)*Math.sin(x/(planet.size-1)*Math.PI)*dis;
        }
    }
    pl.ox=new Array(pl.dx.length);pl.oy=new Array(pl.dy.length);pl.oz=new Array(pl.dz.length);
    var i=pl.dx.length;
    while(i--){
        pl.ox[i]=pl.dx[i];
        pl.oy[i]=pl.dy[i];
        pl.oz[i]=pl.dz[i];
    }
    console.log("changed");

}
function ar(){
    this.d1;this.d2;this.d3;
    this.mx;this.my;this.mz;this.dis;this.color;
    this.reference;
    return this;
}
function line(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}
function triangle(a,x,y,c){
    c=c || ctx;
    c.beginPath();
    c.moveTo(x+a.reference.dx[a.d1]*zoom,y+a.reference.dy[a.d1]*zoom);
    c.lineTo(x+a.reference.dx[a.d2]*zoom,y+a.reference.dy[a.d2]*zoom);
    c.lineTo(x+a.reference.dx[a.d3]*zoom,y+a.reference.dy[a.d3]*zoom);
    c.lineTo(x+a.reference.dx[a.d1]*zoom,y+a.reference.dy[a.d1]*zoom);
    c.stroke();
    c.fill();
    c.closePath();
}
function show(a,x,y,c){
    c=c || ctx;
    for(var i=0;i<areas.length;i++){
        c.fillStyle=areas[i].color;
        c.strokeStyle=areas[i].color;
        triangle(areas[i],x,y,c);
    }
}
function rotatexz(a,angle){
    for(var i=0;i<a.size*a.size;i++){
        var ang=Math.atan2(a.dx[i],a.dz[i]),dis=Math.sqrt(a.dx[i]*a.dx[i]+a.dz[i]*a.dz[i]);
        a.dz[i]=Math.cos(ang-angle)*dis;
        a.dx[i]=Math.sin(ang-angle)*dis;
        //console.log(dis);
    }
}
function rotateyz(a,angle){
    for(var i=0;i<a.size*a.size;i++){
        var ang=Math.atan2(a.dy[i],a.dz[i]),dis=Math.sqrt(a.dy[i]*a.dy[i]+a.dz[i]*a.dz[i]);
        a.dz[i]=Math.cos(ang-angle)*dis;
        a.dy[i]=Math.sin(ang-angle)*dis;
        //console.log(dis);
    }
}
function dot_rotatexz_start(a,angle,i){
    var ang=Math.atan2(a.ox[i],a.oz[i]),dis=Math.sqrt(a.ox[i]*a.ox[i]+a.oz[i]*a.oz[i]);
    a.dz[i]=Math.cos(ang+angle)*dis;
    a.dx[i]=Math.sin(ang+angle)*dis;
    a.dy[i]=a.oy[i];
}
function dot_rotateyz_start(a,angle,i){
    var ang=Math.atan2(a.oy[i],a.oz[i]),dis=Math.sqrt(a.oy[i]*a.oy[i]+a.oz[i]*a.oz[i]);
    a.dz[i]=Math.cos(ang+angle)*dis;
    a.dy[i]=Math.sin(ang+angle)*dis;
    a.dx[i]=a.ox[i];
}
function dot_rotatexz_current(a,angle,i){
    var ang=Math.atan2(a.dx[i],a.dz[i]),dis=Math.sqrt(a.dx[i]*a.dx[i]+a.dz[i]*a.dz[i]);
    a.dz[i]=Math.cos(ang+angle)*dis;
    a.dx[i]=Math.sin(ang+angle)*dis;
}
function dot_rotateyz_current(a,angle,i){
        var ang=Math.atan2(a.dy[i],a.dz[i]),dis=Math.sqrt(a.dy[i]*a.dy[i]+a.dz[i]*a.dz[i]);
        a.dz[i]=Math.cos(ang+angle)*dis;
        a.dy[i]=Math.sin(ang+angle)*dis;
}
function rand(ampl){
    return Math.random()*ampl-ampl/2;
}
function twoRound(a){
    return Math.round(Math.exp(log2*Math.round(Math.log2(a))));
}
function setAreas(a,parcel){
    var h=a.size,parcel=parcel || twoRound(100/a.radius/zoom*quality);
    if(parcel<1)    parcel=1;
    if(parcel>(h-1)/4 || parcel==NaN)  parcel=(h-1)/4;
    for(var x=0;x<h;x+=parcel){
        for(var y=0;y<h;y+=parcel){
            dot_rotatexz_start(planet,rxz,x*h+y);
            dot_rotateyz_current(planet,ryz,x*h+y);
        }
    }
    if(parcel!=current_parcel_size){
        areas=[];
        for(var x=0;x<h-parcel;x+=parcel){
            for(var y=0;y<h-parcel;y+=parcel){
                var i=x*h+y;
                var next=(i+parcel)%h==0?parcel-h:parcel,k=areas.length;
                if(i>=h*parcel){
                    areas[k]=new ar();
                    areas[k].reference=a;
                    areas[k].d1=i;
                    areas[k].d2=i+next;
                    areas[k].d3=i+next-h*parcel;
                    areas[k].mx=(a.dx[areas[k].d1]+a.dx[areas[k].d2]+a.dx[areas[k].d3])/3;
                    areas[k].my=(a.dy[areas[k].d1]+a.dy[areas[k].d2]+a.dy[areas[k].d3])/3;
                    areas[k].mz=(a.dz[areas[k].d1]+a.dz[areas[k].d2]+a.dz[areas[k].d3])/3;
                    areas[k].dis=Math.sqrt((areas[k].mx-cx)*(areas[k].mx-cx)+(areas[k].my-cy)*(areas[k].my-cy)+(areas[k].mz-cz)*(areas[k].mz-cz));
                    areas[k].color=get_color((a.terrain[i%a.size][Math.floor(i/a.size)]+
                                           a.terrain[(i+next)%a.size][Math.floor((i+next)/a.size)]+
                                           a.terrain[(i+next-h*parcel)%a.size][Math.floor((i+next-h*parcel)/a.size)])/3,a);
                    k++;
                }
                if(i<h*(h-parcel)){
                    areas[k]=new ar();
                    areas[k].reference=a;
                    areas[k].d1=i;
                    areas[k].d2=i+next;
                    areas[k].d3=i+h*parcel;
                    areas[k].mx=(a.dx[areas[k].d1]+a.dx[areas[k].d2]+a.dx[areas[k].d3])/3;
                    areas[k].my=(a.dy[areas[k].d1]+a.dy[areas[k].d2]+a.dy[areas[k].d3])/3;
                    areas[k].mz=(a.dz[areas[k].d1]+a.dz[areas[k].d2]+a.dz[areas[k].d3])/3;
                    areas[k].dis=Math.sqrt((areas[k].mx-cx)*(areas[k].mx-cx)+(areas[k].my-cy)*(areas[k].my-cy)+(areas[k].mz-cz)*(areas[k].mz-cz));
                    areas[k].color=get_color((a.terrain[i%a.size][Math.floor(i/a.size)]+
                                           a.terrain[(i+next)%a.size][Math.floor((i+next)/a.size)]+
                                           a.terrain[(i+h*parcel)%a.size][Math.floor((i+h*parcel)/a.size)])/3,a);
                }
            }
        }
    }else{
        for(var k=0;k<areas.length;k++){
            areas[k].mx=(a.dx[areas[k].d1]+a.dx[areas[k].d2]+a.dx[areas[k].d3])/3;
            areas[k].my=(a.dy[areas[k].d1]+a.dy[areas[k].d2]+a.dy[areas[k].d3])/3;
            areas[k].mz=(a.dz[areas[k].d1]+a.dz[areas[k].d2]+a.dz[areas[k].d3])/3;
            areas[k].dis=Math.sqrt((areas[k].mx-cx)*(areas[k].mx-cx)+(areas[k].my-cy)*(areas[k].my-cy)+(areas[k].mz-cz)*(areas[k].mz-cz));
        }
    }
    current_parcel_size=parcel;
    areas.sort(compare);

}
function compare(a,b){
    return b.dis-a.dis;
}
function colorPoint(r,g,b,h){
    this.r=r;this.g=g;this.b=b;this.h=h;
    return this;
}
function makeMap(){
    data=ctx.createImageData(planet.size-1,planet.size-1);;
    for(var x=0;x<planet.size;x+=1){
        for(var y=0;y<planet.size;y+=1){
            var c=get_256(planet.terrain[x][y]);
            //if(planet.terrain==NaN) console.log(x,y);
            data.data[(y*planet.size-y+x)*4]=Math.round(c.r);
            data.data[(y*planet.size-y+x)*4+1]=Math.round(c.g);
            data.data[(y*planet.size-y+x)*4+2]=Math.round(c.b);
            data.data[(y*planet.size-y+x)*4+3]=255;
        }
    }
    return data;
}
function getSeed(){
    Apply();
    var qual=Math.round(Math.pow(2,/*document.getElementById("qualSeed").value*/3));;
    var arraySize=((planet.size-1)/qual+1)*((planet.size-1)/qual+1);
    var seed="",nums=0,power=1;
    var show=[];
    seed+=3;
    console.log(qual);
    for(var x=0;x<=(planet.size-1)/qual;x++){
        for(var y=0;y<=(planet.size-1)/qual;y++){
            nums+=Math.round(planet.terrain[x*qual][y*qual]*16+16)*power;
            show.push(planet.terrain[x*qual][y*qual]);
            power*=32;
            if(power>=32768/32){
                seed+=String.fromCharCode(nums);
                nums=0;
                power=1;
            }
        }
    }
    seed+=String.fromCharCode(nums);
    document.getElementById("getSeed").value=seed;
    console.log(seed);
}
function useSeed(){
    Apply();
    var seed=[],terrain=[],str=document.getElementById("useSeed").value,current,power;
    var size=(128/Math.round(Math.pow(2,str[0]-'0'))+1)*(128/Math.round(Math.pow(2,str[0]-'0'))+1),width=Math.round(Math.sqrt(size));
    console.log(size);
    for(var i=1;i<str.length;i++){
        //console.log(i);
        current=str.charCodeAt(i);
        for(power=32;power<=32768/32;power*=32){
            seed.push((Math.floor(current%power/Math.floor(power/16))-8)/8);
            if(seed.length>=size)   break;
        }
    }
    for(var x=0;x<width;x++){
        terrain[x]=[];
        for(var y=0;y<width;y++){
            terrain[x][y]=seed[x*width+y];
        }
    }
    var ampl=document.getElementById("ampl").value || 0,qual=document.getElementById("qual").value || 6;
    planet=new planet_model(ampl,document.getElementById("water").checked,129,terrain);
    current_parcel_size=-1;
    areas=[];
    setAreas(planet);
    map_img=makeMap();
    draw();
}






var planet=new planet_model(document.getElementById("ampl").value,document.getElementById("water").checked,129);//the planet
var areas=[],quality=32;//the polygons that create the planet
var log2=Math.log(2);//logaritm 2
var cx=0,cy=0,cz=-600,zoom=2;//camera coordinates
var mx,my,lx,ly,drag=false;//mouse coordinates,last mouse coordinates
var tins=[],select=0;//text inputs
var buttons=[];//buttons
var rxz=0,ryz=0;//rotate xz and yz
var cp=[];//color points on the height map
var current_parcel_size=-1;//how many points x contain one polygon
var map_img;//imageData of the map
cp.push(new colorPoint(0,0,256,-1));//blue
cp.push(new colorPoint(128,128,265,0));//white blue
cp.push(new colorPoint(0,256,0,0));//green
cp.push(new colorPoint(192,192,96,0.5))//white
cp.push(new colorPoint(256,256,200,0.25));//yellow
cp.push(new colorPoint(139,69,19,1));//brown
cp.sort(function (a,b){return a.h-b.h});//sort the colors by height
function Apply(){
    var ampl=document.getElementById("ampl").value || 0,qual=document.getElementById("qual").value || 6;
    console.log(ampl,qual)
    quality=Math.round(Math.pow(2,qual));
    change_amplitude(planet,ampl,document.getElementById("water").checked);
    current_parcel_size=-1;
    areas=[];
    setAreas(planet);
    draw();
}//button for applying the changes
function NewMap(){
    var ampl=document.getElementById("ampl").value || 0,qual=document.getElementById("qual").value || 6;
    quality=Math.round(Math.pow(2,qual));
    planet=new planet_model(ampl,document.getElementById("water").checked,129);
    current_parcel_size=-1;
    areas=[];
    setAreas(planet);
    map_img=makeMap();
    draw();
}
map_img=makeMap();//creating the map imageData to print it directly
setAreas(planet,areas);//set the polygons, that create the planet for first time









window.addEventListener("keydown", function (args) {

}, false);

window.addEventListener("keyup", function (args) {

}, false);

window.addEventListener("mouseup", function (args) {
        drag=false;
        mx=args.pageX-args.offsetX;
        my=args.pageY-args.offsetY;
}, false);

window.addEventListener("mousemove", function (args) {
        lx=mx;
        ly=my;
        mx=args.pageX-args.offsetX;
        my=args.pageY-args.offsetY;
    if(mx>0 && mx<canvas.width && my>0 && my<canvas.height){
        if(drag){
            rxz+=(lx-mx)/1440*Math.PI;
            ryz+=(ly-my)/1440*Math.PI;
            setAreas(planet);
            draw();
        }
    }
}, false);

window.addEventListener("mousedown", function (args) {
    mx=lx=args.pageX-args.offsetX;
    my=ly=args.pageY-args.offsetY;
    if(mx>0 && mx<canvas.width && my>0 && my<canvas.height){
        drag=true;
    }
}, false);
window.addEventListener("mousewheel", function (args) {
        lx=mx;
        ly=my;
        mx=args.pageX-args.offsetX;
        my=args.pageY-args.offsetY;
    if(mx>0 && mx<canvas.width && my>0 && my<canvas.height){
        if(args.wheelDelta==-120)   zoom*=10/9;
        if(args.wheelDelta==120)    zoom*=0.9;
        args.preventDefault();

        setAreas(planet);
        draw();
        return false;
    }
}, false);

function update() {
    if(document.getElementById("rotate").checked){
        rxz+=Math.PI/144;
        setAreas(planet);
        draw();
    }
	setTimeout(update, 10);
}
function get_color(a){
    for(var i=0;i<cp.length-1;i++){
        if(a<=cp[i+1].h){
            var minr=cp[i].r>cp[i+1].r?cp[i+1].r:cp[i].r,maxr=cp[i].r<cp[i+1].r?cp[i+1].r:cp[i].r,
                ming=cp[i].g>cp[i+1].g?cp[i+1].g:cp[i].g,maxg=cp[i].g<cp[i+1].g?cp[i+1].g:cp[i].g,
                minb=cp[i].b>cp[i+1].b?cp[i+1].b:cp[i].b,maxb=cp[i].b<cp[i+1].b?cp[i+1].b:cp[i].b;
            var pr=1-(cp[i+1].h-a)/(cp[i+1].h-cp[i].h)
            var r=pr*cp[i+1].r+(1-pr)*cp[i].r,
                g=pr*cp[i+1].g+(1-pr)*cp[i].g,
                b=pr*cp[i+1].b+(1-pr)*cp[i].b;
            return "rgb("+Math.round(r)+","+Math.round(g)+","+Math.round(b)+")";
        }
    }
    return 'black';
}
function get_256(a){
    for(var i=0;i<cp.length-1;i++){
        if(a<=cp[i+1].h){
            var minr=cp[i].r>cp[i+1].r?cp[i+1].r:cp[i].r,maxr=cp[i].r<cp[i+1].r?cp[i+1].r:cp[i].r,
                ming=cp[i].g>cp[i+1].g?cp[i+1].g:cp[i].g,maxg=cp[i].g<cp[i+1].g?cp[i+1].g:cp[i].g,
                minb=cp[i].b>cp[i+1].b?cp[i+1].b:cp[i].b,maxb=cp[i].b<cp[i+1].b?cp[i+1].b:cp[i].b;
            var pr=1-(cp[i+1].h-a)/(cp[i+1].h-cp[i].h)
            var r=pr*cp[i+1].r+(1-pr)*cp[i].r,
                g=pr*cp[i+1].g+(1-pr)*cp[i].g,
                b=pr*cp[i+1].b+(1-pr)*cp[i].b;
            return {r:r,g:g,b:b};
        }
    }
}
ctx.font="20px ComicSans";
ctx.lineWidth=1;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    show(planet,canvas.width/2,canvas.height/2+50);
    ctx.getImageData(0,0,200,200);
    ctx.fillStyle="black";
    ctx.strokeStyle="black";
    for(var i=0;i<tins.length;i++){
        ctx.fillText(tins[i].d+":",tins[i].x-ctx.measureText(tins[i].d+":").width,tins[i].y+(tins[i].sy+parseInt(ctx.font)/2)/2);
        if(i==select)ctx.strokeRect(tins[i].x,tins[i].y,tins[i].sx,tins[i].sy);
        ctx.fillText(tins[i].text,tins[i].x,tins[i].y+(tins[i].sy+parseInt(ctx.font)/2)/2);
    }
    for(var i=0;i<buttons.length;i++){
        ctx.fillStyle="#8888ff";
        ctx.fillRect(buttons[i].x,buttons[i].y,buttons[i].sx,buttons[i].sy);
        ctx.fillStyle="#000000";
        ctx.fillText(buttons[i].d,buttons[i].x+(buttons[i].sx-ctx.measureText(buttons[i].d).width)/2
                                 ,buttons[i].y+(buttons[i].sy+parseInt(ctx.font)/2)/2);
    }
    ctx.strokeStyle="black";
    ctx.strokeRect(1,1,planet.size+5,planet.size+5);
    ctx.fillStyle="white";
    ctx.fillRect(2,2,planet.size+3,planet.size+3);
    ctx.putImageData(map_img,4,4);
    //requestAnimationFrame(draw);
}
function getImg(){
    Apply();
    var zsafe=zoom;
    zoom=2-planet.ampl/200;
    var icanvas=document.createElement("canvas");
    icanvas.width=500;
    icanvas.height=600;
    var ictx=icanvas.getContext("2d");
    setAreas(planet,1);
    show(planet,250,350,ictx);
    var name=document.getElementById("name").value;
    ictx.font="100px ComicSans";
    ictx.textAlign="center";
    ictx.fillStyle="black";
    ictx.fillText(name,250,100,490);
    ictx.strokeStyle="rgb(128,128,256)";
    ictx.lineWidth=5;
    ictx.strokeText(name,250,100,490);
    document.getElementById("planet-img").name=name;
    document.getElementById("planet-img").src=icanvas.toDataURL();
    zoom=zsafe;
    ctx.lineWidth=1;

}
update();/*
    for(var i=-1;i<1;i+=0.01){
        ctx.fillStyle=get_color(i);
        ctx.fillRect(0,200+i*200,100,2);
    }
    for(var i=-1;i<1;i+=0.01){
        if(Math.floor(i*100)%10==0)    ctx.strokeText(Math.floor(i*100),0,220+i*200);
    }*/
draw();
