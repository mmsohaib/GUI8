
/*
Muhammad Muneeb
Assignment 8
 */
 // Create tables and fill it by using data proovided
 function printTable(minNumValueX, maxNumValueX, minNumValueY, maxNumValueY)
 {
     var table = document.createElement('table');
     table.id = 'table';
     var firstRow = true;
     var firstCol = true;

     var i = minNumValueY - 1;
     while(i <= maxNumValueY)
     {
       //creating row
         var tableRow = document.createElement('tr');

         var j = minNumValueX - 1;
         while(j <= maxNumValueX)
         {
             var cell;
             var cellText;
             if(firstRow)
             {
                 cell = document.createElement('th');
                 if(!firstCol)
                 {
                     cellText = document.createTextNode(j);
                     cell.appendChild(cellText);
                 }
             }
             else
             {
                 if(firstCol)
                 {
                     cell = document.createElement('th');
                     cellText = document.createTextNode(i);
                     cell.appendChild(cellText);
                 }
                 else
                 {
                     cell = document.createElement('td');
                     cellText = document.createTextNode(i * j);
                     cell.appendChild(cellText);
                 }
             }
             //Adding cell to a row
             tableRow.appendChild(cell);
             firstCol = false;
             j++;
         }
         // adding row to a table
         table.appendChild(tableRow);
         firstRow = false;
         firstCol = true;
         i++;
     }
     return table;
 }


 /**
 this funtion apends a given HTMl element to given parent node as th eoarent
 node child and see's if it have same id or not.
 */
 function appendReplaceHtmlElement(newHtmlElement, parentNode) {
    var oldHtmlElement;
    if((oldHtmlElement = document.getElementById(newHtmlElement.id)) &&
       oldHtmlElement.parentNode === parentNode) {

         // if id have elements replace it with the existing elemets
         // with same parent.
        parentNode.replaceChild(newHtmlElement, oldHtmlElement);
    } else {
        parentNode.appendChild(newHtmlElement);
    }
}


if (typeof formControler == "undefined")
{
    var formControler = (function()
    {
      var tabs = $('#tableTabs').tabs();
        var tabHandles = tabs.find('ul');
        var tabCounter = 0;


        // create event listner and trigger numbers entered in the form and
        // I ussed jQuery plugin for to check validation of the form data
       // if the data is valid submit them to draw the table by using printTable,
       // replaceElement() and formControler
       var inTheTable = function() {
           // jQuery addMethod to compare the validation
           jQuery.validator.addMethod(
               "compareTo",function(value, element, params)
               {
               var first_num = parseInt(value);
               var second_num = parseInt($('input[name="' + params[0] + '"]').val());

               // If first num or second num are NaN, they weren't parsable numbers.
               // if fist or second number is Nan than they are unparsable
               if(isNaN(first_num) || isNaN(second_num)) return true;

               if(params[2])
               {
                   return first_num <= second_num;
               }
               else
               {
                   return first_num >= second_num;
               }
           },'MAX value (1) must be >= Min (1) value.');


           $('form').validate(
               {
                 // form input rules.
                 rules: {
                   multiplierMin: {
                       required: true,
                       number:   true,
                       step:     1,
                       compareTo:    // should be <= maxNumX.
                           ['multiplierMax', 'multiplier', true]
                   },
                   multiplierMax: {
                       required: true,
                       number:   true,
                       step:     1,
                       compareTo:      // should be >= minNumX.
                           ['multiplierMin', 'multiplier', false]
                   },
                   multiplicandMin: {
                       required: true,
                       number:   true,
                       step:     1,
                       compareTo:      // should be <= maxNumY.
                           ['multiplicandMax', 'multiplicand', true]
                   },
                   multiplicandMax: {
                       required: true,
                       number:   true,
                       step:     1,
                       compareTo:      // should be >= minNumY.
                           ['multiplicandMin', 'multiplicand', false]
                   }
                 },

                 // error showing place
                 showErrors: function(error, errorMap)
                 {
                   var maxError = false;
                   // default error showing
                   this.defaultShowErrors();

                     // iterate to show error message
                     errorMap.forEach(function(error)
                     {
                         if(error.method === 'compareTo')
                         {
                           // see if the error is compareTo error
                            maxError = true;
                            $('#' + error.element.name + '-error').empty();
                            var type = error.element.name.slice(0, -3);
                            $('#' + type + 'Error').html(error.message);
                            $('#' + type + 'Error').removeClass('hidden');
                        }
                    });

                    if(errorMap.length === 0 || !maxError )
                    {
                        // remove error and share error locaton
                        this.currentElements.each(function(index, element)
                        {
                            var type = element.name.slice(0, -3);
                            $('#' + type + 'Error').empty();
                            $('#' + type + 'Error').addClass('hidden');
                        });
                    }
                },

                // Error messages
                messages:
                {
                    multiplierMin:
                    {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    multiplierMax:
                    {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    multiplicandMin:
                    {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    },
                    multiplicandMax:
                    {
                        required: 'Value cannot be empty.',
                        number: 'Value must be an integer.',
                        step: 'Decimals not allowed. Value must be an integer.'
                    }
                },

                // when everything passes make table
                submitHandler: function(form, event)
                {
                    event.preventDefault();
                    tabCreater(form);
                }
            });

            $('.slider').slider({
                value: 0, min: -12, max: 12,
                slide: function(event, ui)
                {
                    $(this).siblings('input').val(ui.value);
                    $(this).siblings('input').valid();
                },
                change: function(event, ui)
                {
                    var form = $(this).closest("form")[0];
                    var dynamic = form.elements['dynamicTab'].checked;
                    if( dynamic && $(form).valid() )
                    {
                        updateActiveTab(form);
                    }
                }
            });

            $('input[type="number"]').on('input', function(event)
            {
                $(this).siblings('.slider').slider('value', $(this).val());
                var form = $(this).closest("form")[0];
                var dynamic = form.elements['dynamicTab'].checked;
                if( dynamic && $(form).valid() )
                {
                    updateActiveTab(form);
                }
            });
        };

        tabs.on( 'click', '.tabClose', function()
        {
            //Get the tab handle to remove
            var li = $(this).closest('li');
            var index = li.index();
            var activeTab = tabs.tabs('option', 'active');
            //Use the tab handles href as a selector to remove content
            $(li.find('a').attr('href')).remove();
            // remove handler from tab
            li.remove();
            tabs.tabs('refresh');
            var remaining = tabHandles.find('li').length;
            if( remaining === 0 )
            {
                TabToggle(false);
            }
             else if( activeTab === index )
             {
                if(remaining <= index ) {
                    index = remaining-1;
                }
                tabs.tabs('option', 'active', index);
            }
        });

        $('#removeAllTabs').on( 'click', function() {
            tabHandles.empty();
            tabs.find(":not(:first-child)").remove();
            tabs.tabs('refresh');
            TabToggle(false);
        });

        var removeTabsToSide = function(activeTab, toRight)
        {
            var tabHandlesList = tabHandles.find('li');
            var end = activeTab;
            var start = 0;
            if(toRight)
            {
                end = tabHandlesList.length;
                start = activeTab+1;
            }
            var i = start
            while(i < end)
            {
                var li = tabHandlesList.eq(i);

                // use tab to remove content
                $(li.find('a').attr('href')).remove();
                li.remove();
            }
            tabs.tabs('refresh');
        }

        var TabToggle = function(show) {
            if( show )
            {
                tabs.removeClass('hidden');
                $('#tabButtons').removeClass('hidden');
            } else {
                tabs.addClass('hidden');
                $('#tabButtons').addClass('hidden');
            }
        }

        var dataTable = function(form, titleHolder, contentTabHold)
        {
            var multiplierMin = form.elements['multiplierMin'].value;
            var multiplierMax = form.elements['multiplierMax'].value;
            var multiplicandMin = form.elements['multiplicandMin'].value;
            var multiplicandMax = form.elements['multiplicandMax'].value;

            // tab title
            var tabTitle =
                    '[' + multiplierMin +
                    '] to [' + multiplierMax +
                    '] by [' + multiplicandMin +
                    '] to [' + multiplicandMax + ']';

            titleHolder.innerHTML = tabTitle;

            // content to tab handler
            var table = printTable( multiplierMin, multiplierMax,
                    multiplicandMin, multiplicandMax);
            $(contentTabHold).empty();
            appendReplaceHtmlElement(table, contentTabHold);
        }

        var updateActiveTab = function(form){
            var activeTab = tabs.tabs('option', 'active');
            if( activeTab === false )
            {
                tabCreater(form);
            } else {
                var tabHandle = tabHandles.find('li').eq(activeTab);
                var titleHolder = tabHandle.find('a');
                var contentTabHold = $(titleHolder.attr('href'));
                dataTable(form, titleHolder[0], contentTabHold[0]);
                tabs.tabs('refresh');
            }

        }

        var tabCreater = function(form)
        {
            if(!tabs.is(':visible'))
            {
                TabToggle(true);
            }

            //Id for each tab
            var tabID = "tab-" + tabCounter;
            tabCounter++;

            // tab handler
            var li = document.createElement('li');
            li.id = "handle-" + tabID;
            var a = document.createElement('a');
            a.href = "#" + tabID;
            li.appendChild(a);

            //Add a close button
            var div = document.createElement('div');
            div.className = "tabClose";
            div.appendChild(document.createTextNode('x'));
            li.appendChild(div);
            tabHandles.append(li);

            //Add the tab content holder
            var div = document.createElement('div');
            div.id = tabID;
            tabs.append(div);

            //Add the table title and table to the tab
            dataTable(form, a, div);
            tabs.tabs('refresh');

            // Select the new tab
            var index = tabHandles.find('li').length-1;
            tabs.tabs("option", "active", index);
        };
        return {
            inTheTable: inTheTable
        };
    })();
    // When document is loaded initilize the javascript
    document.addEventListener('DOMContentLoaded', formControler.inTheTable);
};
