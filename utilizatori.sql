create table utilizatori(
	id serial primary key,
	username varchar(25) not null,
	nume varchar(25) not null,
	prenume varchar(35) not null,
	email varchar(50) not null,
	parola varchar(100) not null,
	data_inregistrarii date default current_timestamp,
	rol varchar(10) default 'comun',
	blocat boolean default false,
	imagine varchar(50)
	
);