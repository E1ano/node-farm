module.exports = (templateCard, product) => {
  let output = templateCard;
  const placeholders = {
    '{%PRODUCT_NAME%}': product.productName,
    '{%IMAGE%}': product.image,
    '{%PRICE%}': product.price,
    '{%FROM%}': product.from,
    '{%NUTRIENTS%}': product.nutrients,
    '{%QUANTITY%}': product.quantity,
    '{%DESCRIPTION%}': product.description,
    '{%ID%}': product.id,
    '{%NOT_ORGANIC%}': product.organic ? '' : 'not-organic',
  };

  // Loop through each placeholder and replace it with the corresponding product data
  for (let placeholder in placeholders) {
    output = output.replace(
      new RegExp(placeholder, 'g'),
      placeholders[placeholder]
    );
  }

  return output;
};
