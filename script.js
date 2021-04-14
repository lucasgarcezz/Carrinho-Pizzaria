    let modalQt = 1;
    let cart = [];
    let modalKey = 0;


    const c = (el) => document.querySelector(el);
    const a = (el) => document.querySelectorAll(el);

    //Listagem das pizzas;
    pizzaJson.map((item, index) => {
        let pizzaItem = c('.models .pizza-item').cloneNode(true); //clonando um item do meu html
        // preenchendo as info de pizza item

        pizzaItem.setAttribute('data-key', index);

        pizzaItem.querySelector('.pizza-item--img img').src = item.img;
        pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
        pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
        pizzaItem.querySelector('.pizza-item--price').innerHTML = item.price[2]; // (ADD) preco [2] pq quero pegar os items do array
        pizzaItem.querySelector('.pizza-item--img img').innerHTML = item.img;
        pizzaItem.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();

            let key = e.target.closest('.pizza-item').getAttribute('data-key');
            modalQt = 1; //resentando modal
            modalKey = key;


            //-------------------preenchendo o modal com as infos das pizzas //-------------------
            c('.pizzaBig img').src = pizzaJson[key].img;
            c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; //preenchendo o modal com o nome da pizza
            c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            c('.pizzaInfo--actualPrice').innerHTML = pizzaJson[key].price[2].toFixed(2);  // (ADD)

            c('.pizzaInfo--size.selected').classList.remove('selected'); // removendo a class de seleção daquele item

            a('.pizzaInfo--size').forEach((size, sizeIndex) => {
                if (sizeIndex == 2) {
                    size.classList.add('selected'); // add para semmpre que sair e voltar ao modal esta selecionado o temanho maior
                }
                size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]; // acessando informações sobre tamanho das pizzas
            });

            a('.pizzaInfo--size').forEach((price, itemPrice) => {  //colocando valor dependendo do tamanho (ADD)
                price.addEventListener('click', () => {
                    c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[itemPrice].toFixed(2)}`;

                });
            });



            c('.pizzaInfo--qt').innerHTML = modalQt; //resentando modal
            //--------------------------------------//----------------------------------------------------
            c('.pizzaWindowArea').style.opacity = 0;
            c('.pizzaWindowArea').style.display = 'flex'; //colocando um display flex para aprecer um modal que esta com display none
            setTimeout(() => {
                c('.pizzaWindowArea').style.opacity = 1;
            }, 200);


        }); // bloquenado o evento da ta a e criando outro


        c('.pizza-area').append(pizzaItem); // append para adicionar pizza item dentro das areas das pizzas

    });

    //Eventos do Modal;
    function closeModal() { //criando função de fechar modal
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(() => {
            c('.pizzaWindowArea').style.display = 'none';
        }, 500);
    }
    a('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((i) => { //atribuindo função de fechar modal as determiandas div marcadas com .

        i.addEventListener('click', closeModal)
    });

    c('.pizzaInfo--qtmenos').addEventListener('click', () => {
        if (modalQt > 1) {
            modalQt--;
            c('.pizzaInfo--qt').innerHTML = modalQt;
        }
    });

    c('.pizzaInfo--qtmais').addEventListener('click', () => {
        modalQt++;
        c('.pizzaInfo--qt').innerHTML = modalQt; //colocando novo valor na var modal

    });

    a('.pizzaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', () => {
            c('.pizzaInfo--size.selected').classList.remove('selected');
            size.classList.add('selected');
        });
    });

    c('.pizzaInfo--addButton').addEventListener('click', () => {
        //QUAL A PIZZAconsole.log(modalKey);
        //QUANTIDADE DE PIZZAS console.log(modalQt)
        // TAMANHO DA PIZZA
        let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
        let identifier = pizzaJson[modalKey].id + '@' + size; //identidicador para relacionar quantidade e tamanho
        let key = cart.findIndex((item) => item.identifier == identifier); // condicao para juntar e somar pizzas de mesmas propriedades
        if (key > -1) {
            cart[key].qt += modalQt; // aumentando a qt caso nao tenha uma pizza de msm sabor e tamanho
        } else {
            cart.push({ // add ao carrinho
                identifier,
                id: pizzaJson[modalKey].id,
                size: size,
                qt: modalQt

            });
        };
        updateCart()
        closeModal();

    });


    c('.menu-openner').addEventListener('click', () => {
        if (cart.length > 0) {
            c('aside').style.left = '0'; // aplicando um style caso tenha itens no carrinho para mobile
        };
    }); //ação de abrir o menu no mobile

    c('.menu-closer').addEventListener('click', () => {
        c('aside').style.left = '100vw';
    }); // tirando menu via js no cel
    function updateCart() { //mostando ou nao o carrinho
        c('.menu-openner span').innerHTML = cart.length; // dando update na tela do cel




        if (cart.length > 0) {
            c('aside').classList.add('show'); // ad a class que foi criada chamada de show para aparecer o carrinho
            c('.cart').innerHTML = '';

            let subtotal = 0;
            let desconto = 0;
            let total = 0;

            for (let i in cart) {
                let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
                subtotal += pizzaItem.price[cart[i].size] * cart[i].qt; // calculando subtotal; (ADD a parte do size) [cart[i].size]


                let cartItem = c('.models .cart--item').cloneNode(true);

                let pizzaSizeName;
                switch (cart[i].size) {
                    case 0:
                        pizzaSizeName = 'P'
                        break;
                    case 1:
                        pizzaSizeName = 'M'
                        break;
                    case 2:
                        pizzaSizeName = 'G'
                        break;
                }

                let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
                //add as infos da pizza no carrinho//

                cartItem.querySelector('img').src = pizzaItem.img;
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {

                    if (cart[i].qt > 1) {
                        cart[i].qt--;
                    } else {
                        cart.splice(i, 1);
                    }

                    updateCart();
                });
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                    cart[i].qt++;
                    updateCart();
                });


                //--------------------------------//


                c('.cart').append(cartItem);

            }

            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`; // comando last-child para pergar ultimo item do span
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        } else {
            c('aside').classList.remove('show');
            c('aside').style.left = '100vw'
        };
    };