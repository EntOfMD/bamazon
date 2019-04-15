const mysql = require('mysql');
const inquirer = require('inquirer');
const columnify = require('columnify');

const dbAuth = require('./DB/dbAuth');

const connection = mysql.createConnection(dbAuth('bamazon'));

const fx = {
  forSale: function() {
    connection.query('select * from products', (err, res) => {
      if (err) throw err;
      console.log(
        columnify(res, {
          columns: [
            'item_id',
            'product_name',
            'department_name',
            'price',
            'stock_qty'
          ],
          config: {
            product_name: {
              headingTransform: function(heading) {
                heading = `Product Name
                    ------------------`;
                return heading;
              }
            },
            item_id: {
              headingTransform: function(heading) {
                heading = `Item #
                    --------`;
                return heading;
              }
            },
            department_name: {
              headingTransform: function(heading) {
                heading = `Department
                    ---------------`;
                return heading;
              }
            },
            stock_qty: {
              headingTransform: function(heading) {
                heading = `# in Stock
                    ------------`;
                return heading;
              }
            },
            price: {
              headingTransform: function(heading) {
                heading = `Price
                        --------`;
                return heading;
              },
              dataTransform: function(data) {
                data = `$${data}`;
                return data;
              }
            }
          },
          columnSplitter: '|',
          align: 'center'
        })
      );
      //   connection.end();
    });
  },
  lowInvetory: function() {
    connection.query(
      'SELECT * FROM products WHERE stock_qty < 5',
      (err, res) => {
        if (err) throw err;
        console.log(
          columnify(res, {
            columns: [
              'item_id',
              'product_name',
              'department_name',
              'price',
              'stock_qty'
            ],
            config: {
              product_name: {
                headingTransform: function(heading) {
                  heading = `Product Name
                      ------------------`;
                  return heading;
                }
              },
              item_id: {
                headingTransform: function(heading) {
                  heading = `Item #
                      --------`;
                  return heading;
                }
              },
              department_name: {
                headingTransform: function(heading) {
                  heading = `Department
                      ---------------`;
                  return heading;
                }
              },
              stock_qty: {
                headingTransform: function(heading) {
                  heading = `# in Stock
                      ------------`;
                  return heading;
                }
              },
              price: {
                headingTransform: function(heading) {
                  heading = `Price
                          --------`;
                  return heading;
                },
                dataTransform: function(data) {
                  data = `$${data}`;
                  return data;
                }
              }
            },
            columnSplitter: '|',
            align: 'center'
          })
        );
        connection.end();
      }
    );
  },
  addInventory: function() {
    connection.query('SELECT * FROM products', (err, res) => {
      if (err) throw err;
      var currentQty = 0;
      var getQty = function(res, item_id) {
        for (i = 0; i < res.length; i++) {
          if (res[i].item_id === item_id) {
            currentQty = parseInt(res[i].stock_qty);
          }
        }
      };

      inquirer
        .prompt([
          {
            name: 'add',
            message: 'Select the item to add more of',
            type: 'list',
            choices: function() {
              var itemArr = [];
              for (i = 0; i < res.length; i++) {
                itemArr.push(res[i].item_id.toString());
              }
              return itemArr;
            }
          }
        ])
        .then(add_id => {
          getQty(res, parseInt(add_id.add));
          inquirer
            .prompt([
              {
                name: 'qty',
                message: 'How many would you like to add?',
                type: 'input'
              },
              {
                name: 'confirm',
                message: `Are you certain?`,
                type: 'confirm',
                default: 'true'
              }
            ])
            .then(add_qty => {
              if (add_qty.confirm) {
                connection.query(
                  'UPDATE products SET ? WHERE ?',
                  [
                    {
                      stock_qty: parseInt(currentQty) + parseInt(add_qty.qty)
                    },
                    {
                      item_id: parseInt(add_id.add)
                    }
                  ],
                  (err, res) => {
                    if (err) throw err;

                    console.log(`Inventory Updated!`);
                    connection.end();
                  }
                );
              } else {
                console.log('have a good day!');
                connection.end();
              }
            });
        });
    });
  }
};
fx.forSale();
fx.addInventory();
