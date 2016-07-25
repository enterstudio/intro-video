$().ready(function () {
    $("#candidate-form").submit(submitHandler);
    
    Candidates.read(function(candidates) {
        candidates.forEach(function (candidate) {
            appendRow(candidate);
        });
    });
});

function submitHandler(event) {
    event.preventDefault();
    
    // TODO: Persist data to backend.
    
    var candidate = new Candidate();
    candidate.firstName = $("#first-name").val();
    candidate.lastName = $("#last-name").val();
    candidate.resume = $("#resume").prop("files")[0];
    
    candidate.resume.oncomplete = function(success) {
        appendRow(candidate);
    };
    
    $("#candidate-form").trigger("reset");
    $("#first-name").focus();
}

function appendRow(candidate) {
    var newRow =
        $(`<tr>
            <td>${candidate.lastName}</td>
            <td>${candidate.firstName}</td>
            <td>
                <a target="_blank" href="${candidate.resume ? candidate.resume.url : "#"}">Download</a>
            </td>
        </tr>`)
            .appendTo("#candidate-list > tbody");
            
            var buttonCell = $(`<td></td>`)
        .appendTo(newRow);

    $(`<button class="btn btn-xs btn-danger" onclick="deleteCandidate(event)">
        <span class="glyphicon glyphicon-trash"></span> Delete
    </button>`)
        .appendTo(buttonCell)
        .data("candidate", candidate);
}

function deleteCandidate(event) {
    var source = event.srcElement || event.target;

    var candidate = $(source).data("candidate");
    
    // Back I/O
    candidate.delete();

    $(source).parentsUntil("tbody").remove();
}

function logCandidates() {
    Candidates.read(function (allCandidates) {
        allCandidates.forEach(function (candidate, index) {
            console.log(`${index + 1}) ${candidate.lastName}, ${candidate.firstName}`);
        });
    });
}
