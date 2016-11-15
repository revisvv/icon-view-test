import { app } from '/client/main';

app.service('itemsGenerator', function() {
  this.generate = (number) => {
    let items = [];

    for (let i = 0; i < number; i++) {
      items.push({
        id: `item_${i}`,
        text: `Item Name ${i}`,
        img: `item${i}.png`,
        checked: false
      });
    }

    return items;
  }

  return this;
});
