const trataErros = (response) => {
    let todosErros;

    if(response.errors != undefined){
         todosErros = response.errors
    }else{
        todosErros = response
    }
    if(todosErros !== undefined){
        const rows = [];
        todosErros.map((item, key) => {
            if (item != "success" && item != "danger" && item ){
                    console.log(item);
                    rows.push(
                        <li key = {key}>{item}</li>
                    );
                }
            })
            return (<div>{rows}</div>)
    }
    return (<div>{response.message}</div>)
}


export default trataErros;