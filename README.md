### Task Caesar cipher CLI tool

#### git clone https://github.com/esoshyki/ceasar.git

#### yarn install

#### Availiable settings:

##### * -i --input *
input exists file or enter nothing, otherwise an error will be thrown
```shyki_ceasar -i 1.txt```
```shyki_ceasar --input 1.txt```

##### * -o --output *
Output file name
```shyki_ceasar -o 1.txt```
```shyki_ceasar --output 1.txt```

##### * -s --shift *
Shift value, must be number, otherwise an error will be thrown
If not defined, assigned 0
```shyki_ceasar -s 13```
```shyki_ceasar --shift 24```

##### * -a --actioncod *
Coding setting, required parametre, throw error if not assigned
*Title of parametre is actioncod instead of action, because there was a conflict between 'under the hood' option of commander tool*
Must be decode or encode, otherwise an error will be thrown
```shyki_ceasar -a encode```
```shyki_ceasar --action decode```

#### Almost everything works nice, but steams are God damn'n fowl =)