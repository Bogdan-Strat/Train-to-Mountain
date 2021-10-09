create database db_test encoding 'UTF-8' LC_COLLATE 'ro-RO-x-icu' LC_CTYPE 'ro_RO' TEMPLATE template0;

create USER bogdan1 WITH ENCRYPTED PASSWORD 'bogdan1';
grant ALL PRIVILEGES ON DATABASE db_test to bogdan1;
grant ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to bogdan1;

create type categ_locatie as enum('Carpatii Meridionali', 'Carpatii Occidentali','Carpatii Orientali', 'Muntii Macin');
create type categ_dificultate as enum('usor','mediu','dificil','foarte dificil');
create type categ_marcaj as enum('cerc rosu','cerc albastru', 'cerc galben', 'dunga rosie','dunga albastra','dunga galbena','cruce rosie'
								,'cruce albastra','cruce galbena','triunghi rosu','triunghi galben','triunghi albastru');

create table trasee(
	id serial primary key,
	nume varchar(250) unique not null,
	descriere text,
	imagine varchar(300),
	locatie categ_locatie default 'Carpatii Meridionali',
	marcaj categ_marcaj default 'cruce albastra',
	durata int not null check(durata>=0),
	distanta int not null check(distanta>=0),
	prima_parcurgere timestamp default current_timestamp,
	dificultate categ_dificultate default 'mediu',
	atractii varchar(500),
	apa boolean 
	
);

insert into trasee(nume, descriere, imagine, locatie, marcaj, durata,distanta,prima_parcurgere,dificultate, atractii,apa)
values('Macin-Culmea Pricopanului','Traseul este uşurel, nu prezintă dificultăţi tehnice şi se poate face şi cu copii. Atâta doar atenţie mare la căpuşe.',
	   'pricopan.jpg', 'Muntii Macin', 'dunga albastra',4,12,to_date('07-10-2011','dd-mm-yyyy'),'usor','Vf. Sulucul Mare',False);
	   
insert into trasee(nume, descriere, imagine, locatie, marcaj, durata,distanta,prima_parcurgere,dificultate, atractii,apa)
values('Greci-Vf. Tutuiatu-Luncavita','Deschis tot timpul anului','tutuiatu.jpg', 'Muntii Macin',
	   'triunghi albastru',4,19,to_date('10-03-2014','dd-mm-yyyy'),'mediu','Valea Seaca',False);

INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Sebesu de Sus-Cabana Suru', 'accesibil in toate anotimpurile', 'sebesu-de-sus.jpg', 'Carpatii Meridionali',
			'cerc rosu', 4, 8, to_date('16-07-2017','dd-mm-yyyy'), 'usor', 'Culmea Moasei', True);
		
INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Poiana Brasov-Vf. Postavaru', 'accesibil tot timpul anului', 'postavaru.jpg', 'Carpatii Meridionali',
			'cruce rosie', 7, 20, to_date('24-08-2016','dd-mm-yyyy'), 'mediu', 'Lacul Poiana Ruia, Prapastia Lupului', False);
			
INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Busteni-Cabana Piatra Arsa', 'interzis iarna', 'jepii-mari.jpg', 'Carpatii Meridionali',
			'cruce albastra', 5, 8, to_date('20-07-2014','dd-mm-yyyy'), 'mediu', 'Valea Jepilor Mari', False);
			
INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Busteni-Cabana Malaiesti', 'interzis iarna', 'malaiesti.jpg', 'Carpatii Meridionali',
			'triunghi rosu', 5, 13, to_date('09-06-2018','dd-mm-yyyy'), 'dificil', 'Pichetul Rosu, Poaiana Costilei', False);
	
INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Busteni-Cabana Caraiman', 'interzis iarna', 'jepii-mici.jpg', 'Carpatii Meridionali',
			'dunga albastra', 5, 5, to_date('19-08-2019','dd-mm-yyyy'), 'foarte dificil', 'Cabana Caraiman, Valea Jepilor Mici', False);

INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Izvorul Muntelui-Cabana Dochia', 'accesibil in toate anotimpurile', 'dochia.jpg', 'Carpatii Orientali',
			'dunga rosie', 5, 7, to_date('22-07-2017','dd-mm-yyyy'), 'usor', 'Piatra cu Apa, Curmatura Lutul Rosu', True);

INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Balan-Cabana Piatra Singuratica', 'accesibil in toate anotimpurile', 'piatra-singuratica.jpg', 'Carpatii Orientali',
			'triunghi rosu', 3, 5, to_date('25-08-2013','dd-mm-yyyy'), 'usor', 'Valea Sep', False);


INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Pasul Rotunda-Pasul Setref', 'interzis iarna', 'saua-ineut.jpg', 'Carpatii Orientali',
			'dunga rosie', 26, 58, to_date('04-07-2020','dd-mm-yyyy'), 'foarte dificil', 'Saua Ineut, Saua Gargalan', True);	
			
INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Borsa-Tarnita La Cruce', 'interzis iarna', 'pietrosul-rodnei.jpg', 'Carpatii Orientali',
			'dunga albastra', 8, 14, to_date('11-05-2014','dd-mm-yyyy'), 'dificil', 'Varful Pietrosul Rodnei', False);

INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Sat Pietroasa-Valea Aleului', 'interzis iarna', 'valea-aleului.jpg', 'Carpatii Occidentali',
			'triunghi albastru', 7, 17, to_date('14-06-2016','dd-mm-yyyy'), 'dificil', 'Poiana Aleului, Cascada Bohodei, Valea Serpilor', False);

INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Cabana Padis-Cetatile Ponorului', 'accesul permis tot timpul anului', 'cetatile-ponorului.jpg', 'Carpatii Occidentali',
			'cerc galben', 2, 5, to_date('26-07-2019','dd-mm-yyyy'), 'mediu', 'Poiana Ponor', True);	

INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Cetea-Piatra Cetii', 'accesul permis tot timpul anului', 'piatra-cetii.jpg', 'Carpatii Occidentali',
			'cruce rosie', 5, 10, to_date('14-08-2017','dd-mm-yyyy'), 'usor', 'Baile Romane', True);
			
INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Satul Ghetar-Pestera Scarisoara', 'accesul permis tot timpul anului', 'scarisoara.jpg', 'Carpatii Occidentali',
			'cerc albastru', 1, 2, to_date('18-10-2020','dd-mm-yyyy'), 'usor', 'Pestera Scarisoara', True);

INSERT INTO trasee(
	 nume, descriere, imagine, locatie, marcaj, durata, distanta, prima_parcurgere, dificultate, atractii, apa)
	VALUES ('Saua Vartop-Pietrele Negre', 'accesul permis tot timpul anului', 'groapa-ruginoasa.jpg', 'Carpatii Occidentali',
			'cruce rosie', 3, 7, to_date('31-07-2016','dd-mm-yyyy'), 'usor', 'Groapa Ruginoasa', True);	
