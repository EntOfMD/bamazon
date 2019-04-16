const mysql = require('mysql');
const inquirer = require('inquirer');
const columnify = require('columnify'); //this is to make the data look neat

const dbAuth = require('./DB/dbAuth'); //mysql data is located here

const connection = mysql.createConnection(dbAuth('bamazon'));

//all of the functions are in this object
const fx = {
  //call to display the current store
  displayItems: function() {
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
  //works the main functionality
  openStore: function() {
    inquirer
      .prompt([
        {
          type: 'input',
          message: `Type in the ID of the product you'd like to purchase. Or enter Q to exit`,
          name: 'buy_id'
        }
      ])
      .then(id_answer => {
        console.log(id_answer.buy_id);
        if (id_answer.buy_id === 'Q' || id_answer.buy_id === 'q') {
          console.log(`Have a good day!`);
          connection.end();
        } else {
          inquirer
            .prompt([
              {
                type: 'input',
                message: 'How many units would you like to purchase?',
                name: 'buy_qty'
              }
            ])
            .then(qty_answer => {
              console.log(qty_answer.buy_qty);
              connection.query(
                'SELECT stock_qty,price FROM products WHERE ?',
                {
                  item_id: id_answer.buy_id
                },
                (err, resChecked) => {
                  if (err) throw err;
                  if (resChecked[0].stock_qty > qty_answer.buy_qty) {
                    connection.query(
                      'UPDATE products SET ? WHERE ?',
                      [
                        {
                          stock_qty:
                            resChecked[0].stock_qty - qty_answer.buy_qty
                        },
                        { item_id: id_answer.buy_id }
                      ],
                      (err, res) => {
                        if (err) throw err;
                        console.log(
                          `Thank you for your purchase! Your total is $${resChecked[0]
                            .price * qty_answer.buy_qty}`
                        );
                        inquirer
                          .prompt([
                            {
                              name: 'confirm',
                              message: 'Would you like to shop more?',
                              type: 'confirm',
                              default: 'true'
                            }
                          ])
                          .then(answer => {
                            if (answer.confirm) {
                              fx.displayItems();
                              setTimeout(() => {
                                fx.openStore();
                              }, 100);
                            } else {
                              connection.end();
                            }
                          });
                      }
                    );
                  } else {
                    console.log(
                      `Sorry, insufficient stock. Check back later :)`
                    );
                    inquirer
                      .prompt([
                        {
                          name: 'confirm',
                          message: 'Would you like to try again?',
                          type: 'confirm',
                          default: 'true'
                        }
                      ])
                      .then(answer => {
                        if (answer.confirm) {
                          fx.displayItems();
                          setTimeout(() => {
                            fx.openStore();
                          }, 100);
                        } else {
                          connection.end();
                        }
                      });
                  }
                }
              );
            });
        }
      });
  }
};

connection.connect(err => {
  if (err) throw err;
  console.log(`
Welcome to Bamazon Market!
You are the ${connection.threadId} customer!
Here are the current items for sale.
------------------------------------------------------------------`);
  fx.displayItems();
  setTimeout(() => {
    fx.openStore();
  }, 100);
});
