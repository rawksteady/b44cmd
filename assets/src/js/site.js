//  ======================================================================
//  Variables
//  ======================================================================

    let jsonUrl = 'https://cdn.rawgit.com/rawksteady/b44cmd/' + cmt + '/sets.json';

    const request     = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    const update      = document.getElementById('js-update');
    const list        = document.getElementById('js-cmds');
    const loader      = document.getElementById('js-loader');
    const searchInput = document.getElementById('js-search');





//  ======================================================================
//  Trigger events
//  ======================================================================

    function triggerEvent(el, type) {

        var e = document.createEvent('HTMLEvents');

        e.initEvent(type, false, true);
        el.dispatchEvent(e);

    }





//  ======================================================================
//  Fetch parameters
//  ======================================================================

    function findQuery() {

        let parameter     = window.location.search.replace('?','');
        let hasParameters = (parameter != '' && parameter.length > 0);

        if (hasParameters) {
            searchInput.value = parameter;
            triggerEvent(searchInput, 'keyup');
        }

    }





//  ======================================================================
//  Handle search events
//  ======================================================================

    function addSearch() {

        searchInput.addEventListener('keyup', (e) => {

            let inputValue = e.target.value.toLowerCase();
            let cmds = Array.from(document.getElementsByClassName('cmd'));

            cmds.forEach((cmd) => {

                let filter = cmd.getAttribute('data-filter').toLowerCase();
                let isMatching = filter.indexOf(inputValue) > -1;

                if (isMatching) {
                    cmd.classList.remove('not-matching');
                }
                else {
                    cmd.classList.add('not-matching');
                }

            });

        });

    }





//  ======================================================================
//  Ajax request
//  ======================================================================

    request.onreadystatechange = () => {

        if (request.readyState == 4 && request.status == 200) {

            let b44cmd = JSON.parse(request.responseText);
            let cmds = b44cmd.commands;
            let lastUpdate = b44cmd.updated;

            list.innerHTML = '';

            update.innerHTML = 'Updated: ' + lastUpdate;

            cmds.forEach((cmd) => {

                let item = document.createElement('li');
                item.classList.add('cmd');

                let title = document.createElement('h4');
                title.classList.add('cmd__command');
                title.innerHTML = cmd.prefix + cmd.command;
                item.appendChild(title);

                let description = document.createElement('p');
                description.classList.add('cmd__description');
                description.innerHTML = cmd.description;
                item.appendChild(description);

                if (cmd.examples) {

                    let samples = document.createElement('samp');
                    samples.classList.add('cmd__examples');

                    cmd.examples.forEach((example) => {
                        let sample = document.createElement('kbd');
                        sample.innerHTML = cmd.prefix + example;

                        samples.appendChild(sample);
                    });

                    item.appendChild(samples);
                }

                item.setAttribute('data-filter', title.innerHTML);

                list.appendChild(item);

            });

            loader.classList.add('--out');
            setTimeout(() => {
                loader.remove();
            }, 150);

            setTimeout(() => {
                list.classList.add('--in');
            }, 150);

            addSearch();
            findQuery();

        }

    }

    request.open("get", jsonUrl, true);
    request.send();