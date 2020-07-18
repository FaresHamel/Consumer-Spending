/*************
 * 1. Add Event when to clikc in Button
 * 2. Get input values
 * 3. Add new Item in Data strectures
 * 4. Add new Item in to UI
 * 5. Calculate The Budget
 * 6. Update the UI 
 */

/*
********  Lectur 1 Add Css Template
********  Lectur 2 Add Controlles to UI
********  Lectur 3 Add EventListner 'Enter' and 'click'Button
********  Lectur 4 Read Dtata from UI .
********  Lectur 5 EVENT BUBBLING.
                   TARGET ELEMENT .
                   EVENT DELIGATION.
                   relation between Target element and event delegation .event delegation content event element . 
*/

 // Budget controller
 var budgetcontroller = (function(){

    //  TWO TYPE OBJECT ONE FOR INCOME AND THE LASTE FOR EXPENSE.
    var Expenses = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.presentage = -1;
    };

    var Income = function (id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //DATA 

    //Object content alle datas for user
    var dataalleItems = {
           exp:[],
           inc:[]
    }

    //somme
    var dataTotals = {
            exp:0,
            icome:0,
            budget:0 ,
            procentage:-1
    }

    var calulatePresentage = function(value,totalsIncome){

        var presentage;

            if(totalsIncome > 0){
    
            presentage = Math.round((value / totalsIncome) * 100);
        
            }else{
            
                presentage = -1;
            
            }


        return presentage;
    };

    return{

        addItems:function(type,description,value){
            var newItem,id,resultPresentage;   
            //CREATE NEW AND GET THE LAST ID FROM THE LIST
            if(dataalleItems[type].length - 1 >= 0){
                
                id = dataalleItems[type][dataalleItems[type].length -1].id + 1;
                
            }else{
                id =0;
            }   
           
           // CREATE NEW ITEM 
           if(type === 'exp'){
                 
                resultPresentage = calulatePresentage(value,dataTotals.inc);

                newItem = new Expenses(id,description,value);
                newItem.presentage = resultPresentage;
                           
            }else if(type === 'inc'){
                newItem = new Income(id,description,value);
            }

            //CREATE NEW ITEM
            dataalleItems[type].push(newItem);
            
            return newItem;
         },
        
        calculateTotals:function(type){
            
            var sam = 0;
            dataalleItems[type].forEach(function(el){
                sam = sam + el.value; 
            });
            dataTotals[type] = sam;
            
         },
        
        deletedItems:function(type,id){

            var indexs,inds,typeT;
            
            if(type ==='income'){
                typeT = 'inc';
            }else if(type ==='expenses'){
                typeT = 'exp'; 
            }

           indexs =  dataalleItems[typeT].map(function(element){
                return element.id;
            });

            inds = indexs.indexOf(id);
         
            if(inds !== -1){

             dataalleItems[typeT].splice(inds,1);
             console.log(dataalleItems[typeT]);   
            }
            
         },
        
        calculateBedget:function(){

             // dispay all elements of array and calculate the somme between them
            this.calculateTotals('exp');
            this.calculateTotals('inc');
             
            // 1. calculate total income and expenses .
            dataTotals.budget = dataTotals.inc - dataTotals.exp;
            
            // 2.  calculate the precentage of income that we spen .
            if(dataTotals.inc > 0){
                dataTotals.procentage = Math.round( (dataTotals.exp / dataTotals.inc) * 100 );
            }else{
                dataTotals.procentage = -1;
            }
           
            
            /* 
            ex : exp = 100 ,inc = 200. 100/200 = 0.50 * 100 = 50%  ; 
            we use Math.round for git resul intiger .    
            */
            
         },

        getpresentages:function(){

            var allProsentages = dataalleItems.exp.map(function(elementArray){

                return elementArray.getProcentage();

            });
            return allProsentages;
         },

        gitAllResuls:function(){
            return {

                //get budget result
                budgetResult:dataTotals.budget,
                
                //get expenses Result
                expTotalResult:dataTotals.exp,
                
                //get incom result 
                incTotalsResult:dataTotals.inc,
                
                //get procentag result
                procentagTotalResult:dataTotals.procentage

            };
         },
        
        testin:function(){
            console.log(dataalleItems);
         }
    }
 })();


//UI controller
 var UIcontroller = (function(){

    var DOMinput = {

        selectcountaner:'.contaner_buttom',
        hovercontaner:'.contaner_buttom',
        inputSelect:'.select-form',
        inputDescription:'.form__input',
        inputValue:'.form_input_number',
        inputBtn :'.check_button',
        incomCntrl:'.inc_list_items',
        expCntrl:'.exp_liste_items',
        budegtname:'.dudgut__value',
        expvalue:'.budget__expenses--value',
        incovalue:'.budget__commin--value',
        procentagevalue:'.procentag',
        dateDay:'.day',
        dateYears:'.year',
        dataMonth:'.month'
    };



    var numberFormat = function(value,type){
      
        var numSplit;
        value = Math.abs(value);// get the abselute value like thi if the number 2000 = 2000.00 .
        /*
          1. like this adding + if the type income or adding - if the type exp .

          2. display the value if it is > 2000 and the result like that 2,000 .

          3. if the number float we display like that + or - 2,000.00 .
        */
         value = value.toFixed(2);// if the value is float return 2 number after the Point .
         
         numSplit = value.split('.');// difis the number in number dec and part integer .
         int = numSplit[0];// part integer. int =  2000 .
         dec = numSplit[1];// par decimal.  dec =  0.00 .

         if (int.length > 3) {
             int = int.substr(0,int.length - 3)+','+int.substr(int.length - 3 , 3);// 2333 = 2,333
         }

         return (type === 'income' ? '+' : '-') + ' ' + int +'.'+ dec;
    };

    return{
        
      gitInpt:function(){

            return{
                
                typeSelect:document.querySelector(DOMinput.inputSelect).value,//will be comm or exp.
                description: document.querySelector(DOMinput.inputDescription).value,//will be description.
                value :parseFloat(document.querySelector(DOMinput.inputValue).value)//will number of budget.
                
            };   
        },

      addListItems:function(obj,type){

        var html,newHtml,element;
         
        //CREATE HTML STRING WITH PLACEHOLDER TEXT
          if(type === 'inc'){
            element = DOMinput.incomCntrl;
            html = '<li class="li_list" id ="income-%id%"><span class="tytel_enven">%description%</span><span class="budget_event_comin">%value%</span><button class="btn-delet btn_inc_show" id="btn"><i class="icon-arrows-circle-remove comin_icon"></i></button></li>';
            newHtml = html;
            newHtml = newHtml.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',numberFormat(obj.value,'income'));
         
         }else 
           
            if(type === 'exp'){
             
             element = DOMinput.expCntrl;  
             html = '<li class="li_list" id ="expenses-%id%"><span class="tytel_enven">%description%</span><span class="budget_event">%value%</span><span class="procentag">%presentage%</span><button class="btn-delet btn_exp_show" id="btn"><i class="icon-arrows-circle-remove"></i></button></li>';
             newHtml = html;
             newHtml = newHtml.replace('%id%',obj.id);
             newHtml = newHtml.replace('%description%',obj.description);
             newHtml = newHtml.replace('%value%',numberFormat(obj.value,'expenses'));
             
             if(obj.presentage > 0){
                
                newHtml = newHtml.replace('%presentage%',obj.presentage+'%');
             }else{
                newHtml = newHtml.replace('%presentage%','-');
             }
             
            }

         //REPLACE PLACEHOLDER WITH SOME ACTUELLE DATA
         document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
         
      },
      
      //delet the Items selected from UI
      deletedItemsUI:function(id){

       document.getElementById(id).remove();

      },

      //clear the input fields
      clearFilds:function(){

        document.querySelector('.form_input_number').value = "";
        document.querySelector('.form__input').value = "";

      },

      //display all result in ui
      displayBudget:function(obj){
        
        var type;
        obj.budgetResult > 0 ? type ='income': type ='expenses';

        document.querySelector(DOMinput.budegtname).textContent = numberFormat(obj.budgetResult,type);
        document.querySelector(DOMinput.expvalue).textContent = numberFormat(obj.expTotalResult,'expenses');
        document.querySelector(DOMinput.incovalue).textContent =numberFormat(obj.incTotalsResult,'income');

        if(obj.procentagTotalResult >= 0){
            document.querySelector(DOMinput.procentagevalue).textContent = obj.procentagTotalResult+"%";
        }else{
            // document.querySelector(DOMinput.procentagevalue).style.display = 'none';
            document.querySelector(DOMinput.procentagevalue).textContent = '-';

        }
      },
      getDOMinput:function(){
            return DOMinput;
        }
    }
 })(); 



 //GLOBAL APPLICATION CONTROLLER
 var controller = (function(budcntr,uicontr){

    var input,newItem;
    var DOM = uicontr.getDOMinput();

    var updateBudget = function(){

        // 1. calculate the budget . 
        budcntr.calculateBedget(); 

        // 2. return the budget . 
        var budget = budcntr.gitAllResuls();
        
        // 3. Display the budget UI  .
        uicontr.displayBudget(budget);
    };

    var addItem = function(){
        
        // 1. Get input value .
        input = uicontr.gitInpt();
        if(input.description !=="" && !isNaN(input.value) && input.value > 0){
 
            // 2. Add new Items in Budget Controller .
            newItem = budcntr.addItems(input.typeSelect,input.description,input.value);

            // 3. Add new Item to UI .
            uicontr.addListItems(newItem,input.typeSelect);

            // 4. clear the input . 
            uicontr.clearFilds();

            // 5. update the budget . 
            updateBudget();
        }  
    };

    var cntroleDeletItems = function(event){
        
        var itemID,splitID,type;

        itemID = event.target.parentNode.parentNode.id;

        if(itemID){
            
         splitID = itemID.split('-');

         type = splitID[0];
         
         ID = parseInt(splitID[1]);

        // 1 delete the item from data structure .
           budcntr.deletedItems(type,ID);
            
        // 2 delete the item from ui .
          uicontr.deletedItemsUI(itemID);

        // 3 update the budget.
           updateBudget();
        }
    };

    var sendListener = function(){
        
        document.querySelector(DOM.inputBtn).addEventListener('click',addItem);

        document.addEventListener('keypress',function(event){
    
            if(event.keyCode === 13 || event.which === 13){
                addItem();
            }
        });

        document.querySelector(DOM.selectcountaner).addEventListener('click',cntroleDeletItems);

        document.querySelector(DOM.inputSelect).addEventListener('change',function() {
            
            var evntvalue = event.target.value;

            if(evntvalue === 'inc'){

                document.querySelector(DOM.inputSelect).classList.add('event_change_inc');
                document.querySelector(DOM.inputDescription).classList.add('event_change_inc');
                document.querySelector(DOM.inputValue).classList.add('event_change_inc');
                document.querySelector('.icon-arrows-circle-check').classList.add('icon-arrows-circle-check_inc');

                document.querySelector(DOM.inputSelect).classList.remove('event_change_exp');
                document.querySelector(DOM.inputDescription).classList.remove('event_change_exp');
                document.querySelector(DOM.inputValue).classList.remove('event_change_exp');
                document.querySelector('.icon-arrows-circle-check').classList.remove('icon-arrows-circle-check_exp'); 

            }else if(evntvalue === 'exp'){
                document.querySelector(DOM.inputSelect).classList.add('event_change_exp');
                document.querySelector(DOM.inputDescription).classList.add('event_change_exp');
                document.querySelector(DOM.inputValue).classList.add('event_change_exp');
                document.querySelector('.icon-arrows-circle-check').classList.add('icon-arrows-circle-check_exp'); 

                document.querySelector(DOM.inputSelect).classList.remove('event_change_inc');
                document.querySelector(DOM.inputDescription).classList.remove('event_change_inc');
                document.querySelector(DOM.inputValue).classList.remove('event_change_inc');
                document.querySelector('.icon-arrows-circle-check').classList.remove('icon-arrows-circle-check_inc');
            }

        });

    };
    var displayDateUi = function() {

        var nowDate,month,year,day,allNameMonth;

          nowDate = new Date();

          year = nowDate.getFullYear();
          month = nowDate.getMonth();
          day = nowDate.getDate();
 
          allNameMonth = ['January','February','March','April','May','June','July','August','September','October','November','Desember'];

        
        document.querySelector(DOM.dateDay).textContent =  day;
        document.querySelector(DOM.dataMonth).textContent = allNameMonth[month];
        document.querySelector(DOM.dateYears).textContent =  year;
    };
    return{

        init:function(){
         console.log('Application it is ran');
         uicontr.displayBudget({
            
            //get budget result
             budgetResult:0, 
            
             //get expenses Result
             expTotalResult:0,
            
             //get incom result 
             incTotalsResult:0,
            
             //get procentag result
             procentagTotalResult:-1
         });
         displayDateUi();
         sendListener();
        }
    };

 })(budgetcontroller,UIcontroller);

 controller.init();