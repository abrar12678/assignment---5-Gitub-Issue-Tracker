const issuesContainer = document.getElementById("issues-container");

const allBtn = document.getElementById("all-btn");
const openBtn = document.getElementById("open-btn");
const closedBtn = document.getElementById("closed-btn");

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

const issuesCount = document.getElementById("issues-count");
const loadingSpinner = document.getElementById("loading-spinner");

let issuesData = [];


function handleActiveTab(activeBtn) {
    [allBtn, openBtn, closedBtn].forEach(btn => btn.classList.remove("btn-primary"));
    activeBtn.classList.add("btn-primary");
}

function toggleLoader(show) {
    if (show) {
        loadingSpinner.classList.remove("hidden");
        issuesContainer.innerHTML = "";
    } else {
        loadingSpinner.classList.add("hidden");
    }
}


function displayIssues(issues) {
    issuesContainer.innerHTML = "";
    issuesCount.innerText = `${issues.length} Issues`;

    if (issues.length === 0) {
        issuesContainer.innerHTML = `<p class="col-span-full text-center text-gray-400 mt-10">No issues found.</p>`;
        return;
    }

    issues.forEach(issue => {
        const div = document.createElement("div");
        div.className = "cursor-pointer transition-transform hover:scale-[1.02] w-full h-full";
        div.onclick = () => showModal(issue);

        div.innerHTML = `
            <div class="card h-full w-full bg-white shadow-sm rounded-xl p-5 flex flex-col gap-4 border-t-4 
                ${issue.status === 'open' ? 'border-green-400' : 'border-purple-500'}">
                
                <div class="flex justify-between items-center">
                    <div class="p-2 rounded-full ${issue.status === 'open' ? 'bg-green-50' : 'bg-purple-50'}">
                        <svg class="w-5 h-5 ${issue.status === 'open' ? 'text-green-500' : 'text-purple-500'}" 
                             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            ${issue.status === 'open' ? `<circle cx="12" cy="12" r="10" stroke-dasharray="4 4" />` : 
                            `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11"></polyline>`}
                        </svg>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${issue.priority === 'high' ? 'bg-red-100 text-red-500' : 
                          issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}">
                        ${issue.priority}
                    </span>
                </div>

                <div class="grow">
                    <h2 class="font-semibold text-[14px] leading-tight mb-2">${issue.title}</h2>
                    <p class="text-gray-400 text-[12px] line-clamp-2">${issue.description}</p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    ${issue.labels.map(label => `
                    <span class="flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold
                        ${label === 'bug' ? 'bg-red-50 text-red-400 border-red-100' : 
                          label === 'enhancement' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}">
                        <span>${label === 'bug' ? '🐞' : label === 'enhancement' ? '✨' : '⚙️'}</span> ${label.toUpperCase()}
                    </span>
                    `).join('')}
                </div>

                <hr class="border-gray-100">

                <div class="text-gray-400 text-xs flex flex-col gap-1">
                    <p>#${issue.id} by <span class="font-medium text-gray-600">${issue.author}</span></p>
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        issuesContainer.appendChild(div);
    });
}

function showModal(issue) {
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = `
        <dialog id="issue_modal" class="modal modal-bottom sm:modal-middle">
          <div class="modal-box p-4 sm:p-0 bg-transparent shadow-none border-none max-w-full sm:max-w-fit">
            <div class="card w-full max-w-[380px] mx-auto bg-white shadow-2xl rounded-xl p-6 flex flex-col gap-4 border-t-8 
                ${issue.status === 'open' ? 'border-green-400' : 'border-purple-500'}">
                
                <div class="flex justify-between items-center">
                    <div class="p-2 rounded-full ${issue.status === 'open' ? 'bg-green-50' : 'bg-purple-50'}">
                        <svg class="w-6 h-6 ${issue.status === 'open' ? 'text-green-500' : 'text-purple-500'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            ${issue.status === 'open' ? `<circle cx="12" cy="12" r="10" stroke-dasharray="4 4" />` : 
                            `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11"></polyline>`}
                        </svg>
                    </div>
                    <form method="dialog"><button class="btn btn-sm btn-circle btn-ghost">✕</button></form>
                </div>

                <div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block ${issue.priority === 'high' ? 'bg-red-100 text-red-500' : issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'}">
                        ${issue.priority}
                    </span>
                    <h2 class="font-bold text-lg mb-2">${issue.title}</h2>
                    <p class="text-gray-500 text-sm mb-4">${issue.description}</p>
                </div>

                <div class="flex flex-wrap gap-2">
                    ${issue.labels.map(label => `
                        <span class="flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold ${label === 'bug' ? 'bg-red-50 text-red-400 border-red-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}">
                            <span>${label === 'bug' ? '🐞' : '⚙️'}</span> ${label.toUpperCase()}
                        </span>
                    `).join('')}
                </div>

                <hr class="border-gray-100">

                <div class="text-gray-400 text-xs">
                    <p>#${issue.id} by <span class="font-medium text-gray-600">${issue.author}</span></p>
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop"><button>close</button></form>
        </dialog>
    `;
    document.body.appendChild(modalContainer);
    const modal = document.getElementById('issue_modal');
    modal.showModal();
    modal.addEventListener('close', () => modalContainer.remove());
}


async function fetchAllIssues() {
    toggleLoader(true);
    try {
        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        issuesData = data.data;
        displayIssues(issuesData);
    }
    catch (error) {
        console.error("Error fetching issues:", error);
    }
    finally {
        toggleLoader(false);
    }
}


allBtn.addEventListener("click", () => {
    handleActiveTab(allBtn);
    toggleLoader(true);
    setTimeout(() => {
        displayIssues(issuesData);
        toggleLoader(false);
    }, 400); 
});

openBtn.addEventListener("click", () => {
    handleActiveTab(openBtn);
    toggleLoader(true);
    setTimeout(() => {
        const openIssues = issuesData.filter(issue => issue.status === "open");
        displayIssues(openIssues);
        toggleLoader(false);
    }, 400);
});

closedBtn.addEventListener("click", () => {
    handleActiveTab(closedBtn);
    toggleLoader(true);
    setTimeout(() => {
        const closedIssues = issuesData.filter(issue => issue.status === "closed");
        displayIssues(closedIssues);
        toggleLoader(false);
    }, 400);
});


searchBtn.addEventListener("click", async () => {
    const text = searchInput.value.trim();
    if (!text) return;

    toggleLoader(true);
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`);
        const data = await res.json();
        displayIssues(data.data);
    }
    catch (error) {
        console.error("Error searching issues:", error);
    }
    finally {
        toggleLoader(false);
    }
});


searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
});


fetchAllIssues();