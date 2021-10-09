const express=require('express');
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const {Client} =require('pg');
const url = require('url');
const { exec } = require("child_process");
const ejs=require('ejs');

const session=require('express-session');
const formidable=require('formidable');
const crypto=require('crypto');
const nodemailer=require('nodemailer');



var app=express();
d=new Date();
app.set("view engine","ejs");

console.log("Proiectul se afla la: ",__dirname);
app.use("/resurse",express.static(__dirname+"/resurse"));

const client=new Client({
    host: 'localhost',
    port: 5432,
    user: 'bogdan1',
    password: 'bogdan1',
    database:'db_test'

});

client.connect()

//setez o sesiune
app.use(session({
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));

async function trimiteMail(username, email){
	var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"site.trasee.montane2021@gmail.com",
			pass:"tehniciweb"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
	//genereaza html
	await transp.sendMail({
		from:"site.trasee.montane2021@gmail.com",
		to:email,
		subject:"Buna "+username,
		//text:"Bine ai venit in comunitatea Pe Acoperisul Romaniei",
		//html:"<h1>Salut!</h1><p>Username-ul tau este "+username+"</p>",
        html:"<h1 style=background-color:powderblue;> Bine ai venit</h1><p> in comunitatea Pe Acoperisul Romaniei</p>",
    })
	console.log("trimis mail");
}

async function trimiteMailBlocare(prenume,nume,email){
    var transp= nodemailer.createTransport({
		service: "gmail",
		secure: false,
		auth:{//date login 
			user:"site.trasee.montane2021@gmail.com",
			pass:"tehniciweb"
		},
		tls:{
			rejectUnauthorized:false
		}
	});
    await transp.sendMail({
		from:"site.trasee.montane2021@gmail.com",
		to:email,
		subject:"Blocare! ",
		//text:"Bine ai venit in comunitatea Pe Acoperisul Romaniei",
		//html:"<h1>Salut!</h1><p>Username-ul tau este "+username+"</p>",
        html:"<p>N-ai fost cuminte "+prenume+nume+" asa ca te-am blocat</p>",
        
    })
    console.log("mail trimis",prenume,nume);
}

function verificaImagini(){
    var textFisier=fs.readFileSync("resurse/json/galerie.json");
    var jsi=JSON.parse(textFisier);

    var caleGalerie=jsi.cale_galerie;
    vectImagini=[]

    for(let im of jsi.imagini){
        d=new Date();
        var imVeche=path.join(caleGalerie, im.cale_imagine);
        var ext=path.extname(im.cale_imagine);
        var numeFisier=path.basename(im.cale_imagine,ext)
        let imMica=path.join(caleGalerie+"/mic/", numeFisier+ "-mic"+".webp");
        let imMedie=path.join(caleGalerie+"/mediu/", numeFisier+"-mediu"+".jpg");
    
        vectImagini.push({mare:imVeche, mediu:imMedie, mic:imMica, descriere: im.descriere,tip:im.sfert_ora, timp:d.getMinutes()});

        if(!fs.existsSync(imMedie))
        sharp(imVeche)
            .resize(175)
            .toFile(imMedie, function(err){
                if(err){
                    console.log("eroare conversie");
                    res.status(403).render("pagini/403Error");
                }
                    
            });
        else if(!fs.existsSync(imMica))
        sharp(imVeche)
            .resize(150)
            .toFile(imMica,function(err){
                if(err){
                    console.log("eroare conversie 2");
                    res.status(403).render("pagini/403Error");
                }
                   
            });
            
    }
    return vectImagini;
}
app.get("/",function(req,res){
    
   res.render("pagini/index",{imagini: verificaImagini(), ip:req.ip,utilizator: req.session.utilizator});
});

app.get("/index",function(req, res){
    res.render("pagini/index",{imagini: verificaImagini(), ip:req.ip,utilizator: req.session.utilizator});
});

app.get("/index/noi",function(req, res){
    res.render("pagini/noi",{utilizator: req.session.utilizator});
});

app.get("*/galerie-animata.css",function(req, res){
    /*Atentie modul de rezolvare din acest app.get() este strict pentru a demonstra niste tehnici
    si nu pentru ca ar fi cel mai eficient mod de rezolvare*/
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss=fs.readFileSync("./resurse/scss/galerie-animata-animatie0.scss").toString("utf-8");//citesc scss-ul cs string
    numere=[3,6,9,12,5]
    let numarAleator =numere[Math.floor(Math.random()*numere.length)];//iau o culoare aleatoare pentru border
    let rezScss=ejs.render(sirScss,{numar:numarAleator});// transmit culoarea catre scss si obtin sirul cu scss-ul compilat
    console.log(rezScss);
    fs.writeFileSync("./resurse/temp/galerie_animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar
    exec("sass ./resurse/temp/galerie_animata.scss ./resurse/temp/galerie-animata1.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(res);
        //totul a fost bine, trimit fisierul rezultat din compilarea scss
        res.sendFile(path.join(__dirname,"temp/galerie-animata1.css"));
    });

});
app.post("/login",function(req,res){
    let formular=formidable.IncomingForm();
    formular.parse(req,function(err,campuriText){
        let parolaCriptata= crypto.scryptSync(campuriText.parola, parolaServer, 32).toString('ascii');  
        let comanda_param= `select id,username,nume,prenume, email,rol from utilizatori where username= $1::text and parola=$2::text`;
        client.query(comanda_param, [campuriText.username, parolaCriptata], function(err, rez){
           console.log(comanda_param);
                if (!err){
                    console.log(rez);
                    if (rez.rows.length == 1){
                        req.session.utilizator={
                            id:rez.rows[0].id,
                            username:rez.rows[0].username,
                            nume:rez.rows[0].nume,
                            prenume:rez.rows[0].prenume,
                            email:rez.rows[0].email,
                            rol:rez.rows[0].rol
                        }
                    }
                    
                }
                    res.redirect("/index");
                
                
            });
    });
});

app.get("/useri",function(req,res){
	
        if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
            client.query("select * from utilizatori",function(err, rezultat){
                if(err) throw err;
                console.log(rezultat);
                res.render('pagini/useri',{useri:rezultat.rows, utilizator:req.session.utilizator});//afisez index-ul in acest caz
            });
        } else{
            res.status(403).render('pagini/403Error',{mesaj:"Nu aveti acces", utilizator:req.session.utilizator});
        }
    
   
});

app.post("/blocheaza_utiliz",function(req,res){
    if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
        var formular= formidable.IncomingForm()
        
        formular.parse(req, function(err, campuriText, campuriFisier){
            var comanda=`update utilizatori set blocat=true  where id='${campuriText.id_utiliz}'`;
            var comanda2=`select prenume,nume,email from utilizatori where id='${campuriText.id_utiliz}'`;
            console.log(comanda);
            client.query(comanda, function(err, rez){
                console.log(comanda2);
                client.query(comanda2,function(err,rez1){
                    console.log(rez1,"aici");
                    trimiteMailBlocare(rez1.rows[0].prenume,rez1.rows[0].nume,rez1.rows[0].email);
                    console.log(rez1.rows[0].prenume,rez1.rows[0].nume,rez1.rows[0].email);
                });
            });
        });
        }
        res.redirect("/useri");
});

app.post("/deblocheaza_utiliz",function(req,res){
    if(req.session && req.session.utilizator && req.session.utilizator.rol=="admin"){
        var formular= formidable.IncomingForm()
        
        formular.parse(req, function(err, campuriText, campuriFisier){
            var comanda=`update utilizatori set blocat=false  where id='${campuriText.id_utiliz}'`;
            //var comanda2=`select prenume,nume,email from utilizatori where id='${campuriText.id_utiliz}'`;
            console.log(comanda);
            client.query(comanda, function(err, rez){
                console.log(comanda);
                /*client.query(comanda2,function(err,rez1){
                    console.log(rez1,"aici");
                    trimiteMailBlocare(rez1.rows[0].prenume,rez1.rows[0].nume,rez1.rows[0].email);
                    console.log(rez1.rows[0].prenume,rez1.rows[0].nume,rez1.rows[0].email);
                });*/
            });
        });
        }
        res.redirect("/useri");
});

app.get("*/galerie.json",function(req,res){
    res.render("pagini/403Error");
});

app.get("/trasee",function(req,res){ 

    let conditie=req.query.locatie?"and locatie='"+req.query.locatie+"'":"";
    client.query("select id,locatie,imagine,nume,durata,descriere,marcaj,atractii,prima_parcurgere,apa from trasee where 1=1"+conditie,function(err,rez){
        console.log(rez.rows);
        res.render("pagini/trasee",{trasee:rez.rows,utilizator: req.session.utilizator});
    });

   
});

app.get("/trasee/:id_traseu",function(req,res){ 
    console.log(req.params.id_traseu);
    client.query("select * from trasee where id="+req.params.id_traseu,function(err,rez){
        console.log(rez.rows);
        res.render("pagini/traseu",{traseu:rez.rows[0],utilizator: req.session.utilizator});
    });


   
});

let parolaServer="tehniciweb"
app.post("/inreg",function(req,res){
    console.log("primit date");
    var username;
    let formular=formidable.IncomingForm();

    formular.parse(req,function(err,campuriText,campuriFisier){
        eroare="";
        if(campuriText.username=="" || campuriText.nume=="" || campuriText.prenume=="" || 
        campuriText.parola=="" || campuriText.email==""){
            eroare+="Camp required necompletat";
        }
        reg=new RegExp("^[a-zA-Z0-9_-]@[a-zaA-Z0-9]{1}?\.{2,3}?[a-zA-Z]$","g");
        if(!campuriText.email.match(reg)){
            eroare+="emailul nu respecta tiparul";
        }
        
        if(!eroare){
            let parolaCriptata= crypto.scryptSync(campuriText.parola,parolaServer,32).toString('ascii');
            let comanda=`insert into utilizatori (username,nume,prenume,email,parola) values ('${campuriText.username}',
            '${campuriText.nume}','${campuriText.prenume}','${campuriText.email}','${parolaCriptata}');`;
            console.log(comanda);
            client.query(comanda,function(err,rez){
                if(err){
                    console.log(err);
                    res.render("pagini/inregistrare",{err:"Eroare baza de date!",raspuns:"Datele nu au fost introduse."});
                
                }
                else{
                    res.render("pagini/inregistrare",{err:"", raspuns:"Totul e bine!"});
                }
            });
        trimiteMail(campuriText.username,campuriText.email);
        }
        else{
                res.render("pagini/inregistrare",{err:"Eroare al formular."+eroare,raspuns:""});
        }

    });

});

app.get("/logout",function(req,res){
    req.session.destroy();
    res.redirect("/index");
});

app.get("/*",function(req,res){
    res.render("pagini"+req.url,function(err,rezultatRandare){
        if(err){
            if(err.message.includes("Failed to lookup view") || err.message.includes("Cannot GET /") ){
                res.status(404).render("pagini/404Error",{utilizator: req.session.utilizator});
            }
            else
                throw err;
        }
        else{
            res.send(rezultatRandare);
        }
    });
});

verificaImagini();
app.listen(8080);
console.log("Serverul a pornit");

