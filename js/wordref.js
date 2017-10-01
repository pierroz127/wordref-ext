var languages = [{"group":{"label":"Spanish","fromTo":[{"id":"enes","value":"enes","text":"English-Spanish"},{"id":"esen","value":"esen","text":"Spanish-English"},{"id":"esfr","value":"esfr","text":"Spanish-French"},{"id":"espt","value":"espt","text":"Spanish-Portuguese"},{"id":"esit","value":"esit","text":"Spanish-Italian"},{"id":"esde","value":"esde","text":"Spanish-German"},{"id":"eses","value":"eses","text":"Spanish: definition"},{"id":"essin","value":"essin","text":"Spanish: synonyms"},{"id":"esconj","value":"esconj","text":"Spanish: conjugations"}]}},{"group":{"label":"French","fromTo":[{"id":"enfr","value":"enfr","text":"English-French"},{"id":"fren","value":"fren","text":"French-English"},{"id":"fres","value":"fres","text":"French-Spanish"},{"id":"frconj","value":"frconj","text":"French: conjugations"}]}},{"group":{"label":"Italian","fromTo":[{"id":"enit","value":"enit","text":"English-Italian"},{"id":"iten","value":"iten","text":"Italian-English"},{"id":"ites","value":"ites","text":"Italian-Spanish"},{"id":"itit","value":"itit","text":"Italian definition"},{"id":"itconj","value":"itconj","text":"Italian: conjugations"}]}},{"group":{"label":"Catalan","fromTo":[{"id":"caca","value":"caca","text":"Català: definició"}]}},{"group":{"label":"German","fromTo":[{"id":"ende","value":"ende","text":"English-German"},{"id":"deen","value":"deen","text":"German-English"},{"id":"dees","value":"dees","text":"German-Spanish"}]}},{"group":{"label":"Dutch","fromTo":[{"id":"ennl","value":"ennl","text":"English-Dutch"},{"id":"nlen","value":"nlen","text":"Dutch-English"}]}},{"group":{"label":"Swedish","fromTo":[{"id":"ensv","value":"ensv","text":"English-Swedish"},{"id":"sven","value":"sven","text":"Swedish-English"}]}},{"group":{"label":"Russian","fromTo":[{"id":"enru","value":"enru","text":"English-Russian"},{"id":"ruen","value":"ruen","text":"Russian-English"}]}},{"group":{"label":"Portuguese","fromTo":[{"id":"enpt","value":"enpt","text":"English-Portuguese"},{"id":"pten","value":"pten","text":"Portuguese-English"},{"id":"ptes","value":"ptes","text":"Portuguese-Spanish"}]}},{"group":{"label":"Polish","fromTo":[{"id":"enpl","value":"enpl","text":"English-Polish"},{"id":"plen","value":"plen","text":"Polish-English"}]}},{"group":{"label":"Romanian","fromTo":[{"id":"enro","value":"enro","text":"English-Romanian"},{"id":"roen","value":"roen","text":"Romanian-English"}]}},{"group":{"label":"Czech","fromTo":[{"id":"encz","value":"encz","text":"English-Czech"},{"id":"czen","value":"czen","text":"Czech-English"}]}},{"group":{"label":"Greek","fromTo":[{"id":"engr","value":"engr","text":"English-Greek"},{"id":"gren","value":"gren","text":"Greek-English"}]}},{"group":{"label":"Turkish","fromTo":[{"id":"entr","value":"entr","text":"English-Turkish"},{"id":"tren","value":"tren","text":"Turkish-English"}]}},{"group":{"label":"Chinese","fromTo":[{"id":"enzh","value":"enzh","text":"English-Chinese"},{"id":"zhen","value":"zhen","text":"Chinese-English"}]}},{"group":{"label":"Japanese","fromTo":[{"id":"enja","value":"enja","text":"English-Japanese"},{"id":"jaen","value":"jaen","text":"Japanese-English"}]}},{"group":{"label":"Korean","fromTo":[{"id":"enko","value":"enko","text":"English-Korean"},{"id":"koen","value":"koen","text":"Korean-English"}]}},{"group":{"label":"Arabic","fromTo":[{"id":"enar","value":"enar","text":"English-Arabic"},{"id":"aren","value":"aren","text":"Arabic-English"}]}},{"group":{"label":"English monolingual","fromTo":[{"id":"enen","value":"enen","text":"English definition"},{"id":"enthe","value":"enthe","text":"English synonyms"},{"id":"enusg","value":"enusg","text":"English usage"},{"id":"encol","value":"encol","text":"English collocations"}]}}]

function fillLanguageGroup(group) {
    var groupNode = document.createElement('optgroup');
    $(groupNode).attr('label', group.label);
    for (var i=0; i<group.fromTo.length; i++) {
        var fromToOption = document.createElement('option');
        $(fromToOption).attr('id', group.fromTo[i].id);
        $(fromToOption).attr('value', group.fromTo[i].value);
        $(fromToOption).text(group.fromTo[i].text);
        $(groupNode).append(fromToOption);
    }
    $('#fSelect').append(groupNode);    
}

function fillLanguageOptions() {
    for (var i=0; i<languages.length; i++) {
        fillLanguageGroup(languages[i].group);
    }
    $('#fSelect').val('enfr');
    $('#fSelect').change(function() {
        $('.response').children().each(function(i,e) { $(e).remove(); });
        getTranslations($('#selectedText').text());
    });
}

function showResponse(fromTo, response) {
    var wrHtml = $(response);
    wrHtml.find('table.WRD').each(function(i, elt) {
        $(elt).find('em.tooltip span').each(function(j, tooltip) {
            $(tooltip).remove();
        });
        $(elt).find('a').each(function(j, conjugate) {
            $(conjugate).remove();
        });
        $(elt).clone().appendTo($('.response'));
    });
}

function getTranslations(text) {
    var fromTo = $('#fSelect').val();
    $('#selectedText').text(text);
    if (text === undefined || text.length === 0) {
        console.log('nothing to translate');
        return;
    }

    $.ajax({
        method: 'GET',
        url: 'http://wwww.wordreference.com/' + fromTo + '/' + text
    }).done(function(resp) { showResponse(fromTo, resp)});
}

$(document).ready(function () {
    fillLanguageOptions();
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { from: 'popup', subject: 'translateSelection' },
            getTranslations);
    });
});