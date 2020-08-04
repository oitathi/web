const formatNumber = (number, precision = 2) => {
    if (!number) {
      return null;
    }
    const thousand = '.';
    const decimal = ',';
    const symbol = number < 0 ? '-' : '';
    const integer = String(parseInt((number = Math.abs(Number(number) || 0).toFixed(precision))));
    const mod = integer.length > 3 ? integer.length % 3 : 0;
    
    return (
      symbol +
      (mod ? integer.substr(0, mod) + thousand : '') +
      integer.substr(mod).replace(/(\d{3})(?=\d)/g, thousand) +
      (precision ? decimal + Math.abs(number - integer).toFixed(precision).slice(2) : '')
    );
  };

  const formatMoney = number => {
    number = formatNumber(number, 2);
    return number ? number : '0,00';
  };
  
  export default formatMoney