var selections = { candidate: null, jobOpening: null };

$().ready(function () {
    
    // Load job candidates and add to list.
    Candidates
        .sort(Candidate.lastName)
        .read(function (candidates) {
        candidates.forEach(function (candidate) {
            renderCandidateItem(candidate);
        });
    });

    // Load job openings and render to page.
    JobOpenings.read(function (jobs) {
        jobs.forEach(function (job) {
            renderJobBox(job);
        });
    });
});

function renderJobBox(job) {
    var jobContainer = $(`<div class="panel panel-${job.allowsRemote ? "success" : "primary"}"></div>`);

    $(`<div class="panel-heading"></div>`)
        .appendTo(jobContainer)
        .text(job.title);

    var panelBody = $(`<div class="panel-body"></div>`)
        .appendTo(jobContainer);

    $(`<p></p>`)
        .appendTo(panelBody)
        .text(job.description);

    var peopleBox = $(`<p></p>`)
        .appendTo(panelBody);

    job.candidates.read(function () {
        job.candidates.forEach(function (candidate) {
            renderPersonTag(candidate, job, peopleBox);
        });
    });

    $(`<button class="btn btn-success${selections.candidate ? "" : " disabled"} add-button"><span class="glyphicon glyphicon-plus"></span> Add Candidate</button>`)
        .appendTo(panelBody)
        .data("job", job)
        .data("peopleBox", peopleBox)
        .click(addCandidate);

    $("#jobs-list").append(jobContainer);
}

function addCandidate(event) {
    if (!selections.candidate)
        return;

    var source = $(event.srcElement || event.target);
    var job = source.data("job");

    if (!job.candidates.includes(selections.candidate))
        job.candidates.push(selections.candidate);

    renderPersonTag(selections.candidate, job, $(source).data("peopleBox"));
}

function removeCandidate(event) {
    var source = $(event.srcElement || event.target).parent();
    var job = source.data("job");
    var candidate = source.data("candidate");

    job.candidates.delete(candidate);

    source.parent().remove();
}

function selectCandidate(event) {
    var source = $(event.srcElement || event.target);
    var candidate = source.data("candidate");

    $("#candidates-list > button").removeClass("active");
    source.addClass("active");

    selections.candidate = candidate;
    $(".add-button").removeClass("disabled");
}

function renderPersonTag(candidate, job, container) {
    var personLabel = $(`<span class="tag label label-info"></span> `)
        .appendTo(container)
        .text(`${candidate.lastName}, ${candidate.firstName} `);

    $(`<a href="javascript:"><span class="remove glyphicon glyphicon-remove-sign glyphicon-white"></span></a>`)
        .appendTo(personLabel)
        .data("job", job)
        .data("candidate", candidate)
        .click(removeCandidate);
}

function renderCandidateItem(candidate)
{
    $(`<button type="button" onclick="selectCandidate(event)" class="list-group-item">${candidate.lastName}, ${candidate.firstName}</button>`)
                .appendTo("#candidates-list")
                .data("candidate", candidate);
}

function populateJobs()
{
    var ts = new JobOpening();
    ts.description = "Find problems. Solve them with code. Test solution. Commit to source control. Repeat.";
    ts.title = "TypeScript Developer";
    ts.allowsRemote = true;
    
    var qa = new JobOpening();
    qa.description = "Break stuff. Tell developers how you broke it.";
    qa.title = "Quality Assurance Tester";
    qa.allowsRemote = true;
    
    var designer = new JobOpening();
    designer.description = "Make pretty pictures, cause developers don't seem to know about colour.";
    designer.title = "Graphic Designer";
    designer.allowsRemote = true;
    
    var lawncare = new JobOpening();
    lawncare.description = "Cut lawns. Weed gardens. Plant flowers. Grow vegetables.";
    lawncare.title = "Gardener";
    lawncare.allowsRemote = false;
}
