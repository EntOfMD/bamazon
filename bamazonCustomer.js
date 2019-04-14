const mysql = require('mysql');
const inquirer = require('inquirer');
const columnify = require('columnify');

const dbAuth = require('./DB/dbAuth');

const connection = mysql.createConnection(dbAuth('bamazon'));

const fx = {
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
    });
  },
  init: function() {
    inquirer
      .prompt([
        {
          type: 'input',
          message: `Type in the ID of the product you'd like to purchase.`,
          name: 'buy_id'
        }
      ])
      .then(id_answer => {
        console.log(id_answer.buy_id);
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
          });
      });
  }
};

connection.connect(err => {
  if (err) throw err;
  console.log(`Connected! ${connection.threadId}`);
  console.log(
    `Welcome to Bamazon Market! Here are the current items for sale.`
  );
  fx.displayItems();
  setTimeout(() => {
    fx.init();
  }, 500);
  connection.end();
});
