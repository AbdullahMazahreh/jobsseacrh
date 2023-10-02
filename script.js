const jobsContainer = document.querySelector(".jobs-container");
const searchInput = document.querySelector(".search-input");
const previousContainer = document.querySelector(
  ".previous-searches-container"
);
const clearSearch = document.querySelector(".clear-searches");

let previousSearches = [];

const fetchJobsInformation = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();

  return data;
};

const createOneJobContainer = (job) => {
  const jobContainer = document.createElement("div");
  const leftSide = document.createElement("div");
  const image = document.createElement("img");
  const infoContainer = document.createElement("div");
  const companyNameContainer = document.createElement("div");
  const companyName = document.createElement("div");
  const positionName = document.createElement("div");
  const jobInfo = document.createElement("div");
  const uploadedTime = document.createElement("div");
  const jobContract = document.createElement("div");
  const jobLocation = document.createElement("div");
  const rightSide = document.createElement("div");

  const filtersOptions = [job.role, job.level, ...job.languages, ...job.tools];

  filtersOptions.forEach((ele) => {
    const jobRequirement = document.createElement("div");
    jobRequirement.textContent = ele;
    jobRequirement.classList.add("job-requirement");
    rightSide.append(jobRequirement);
    jobRequirement.addEventListener("click", () => {
      previousSearches.push(jobRequirement.innerText.toLowerCase());
      updateScreen();
    });
  });

  jobContainer.append(leftSide);
  leftSide.append(image);
  leftSide.append(infoContainer);
  infoContainer.append(companyNameContainer);
  infoContainer.append(positionName);
  infoContainer.append(jobInfo);
  companyNameContainer.append(companyName);
  jobInfo.append(uploadedTime);
  jobInfo.append(jobContract);
  jobInfo.append(jobLocation);
  jobContainer.append(rightSide);

  jobContainer.classList.add("job-container");
  jobContainer.classList.add("box-shadow");
  leftSide.classList.add("left-side");
  image.classList.add("company-image");
  infoContainer.classList.add("info-container");
  companyNameContainer.classList.add("company-name-container");
  companyName.classList.add("company-name");
  positionName.classList.add("position-name");
  jobInfo.classList.add("job-info");
  uploadedTime.classList.add("uploaded-time");
  jobContract.classList.add("job-contract");
  jobLocation.classList.add("job-location");
  rightSide.classList.add("right-side");

  image.src = job.logo;
  companyName.textContent = job.company;
  positionName.textContent = job.position;
  uploadedTime.textContent = job.postedAt;
  jobContract.textContent = job.contract;
  jobLocation.textContent = job.location;

  if (job.new) {
    const newContainer = document.createElement("div");
    newContainer.textContent = "NEW!";
    newContainer.classList.add("new-container");
    companyNameContainer.append(newContainer);
  }
  if (job.featured) {
    const featuredContainer = document.createElement("div");
    featuredContainer.textContent = "FEATURED";
    featuredContainer.classList.add("featured-container");
    companyNameContainer.append(featuredContainer);
  }

  jobsContainer.append(jobContainer);
};

const displayAllJobs = async () => {
  const jobsInformation = await takeSearchValues();

  jobsContainer.innerHTML = "";

  if (jobsInformation.length > 0) {
    jobsInformation.map((job) => {
      return createOneJobContainer(job);
    });
  } else {
    jobsContainer.textContent = "There are no results";
  }
};

const takeSearchValues = async () => {
  const jobsInformation = await fetchJobsInformation();

  let filteredJobs = [...jobsInformation];

  previousSearches.forEach((filter) => {
    filteredJobs = filteredJobs.filter((job) => {
      const jobLanguages = job.languages.map((ele) => ele.toLowerCase());
      const jobTools = job.tools.map((ele) => ele.toLowerCase());
      const jobDetails = [
        job.role.toLowerCase(),
        job.level.toLowerCase(),
        ...jobLanguages,
        ...jobTools,
      ];

      return jobDetails.find((ele) => ele == filter);
    });
  });

  return filteredJobs;
};

const updateScreen = () => {
  const searchValue = searchInput.value.toLowerCase();
  previousContainer.innerHTML = "";
  if (searchValue !== "") previousSearches.push(searchValue);

  previousSearches.forEach((ele, index) => {
    const previouSearch = document.createElement("div");
    previouSearch.classList.add("previous-search");
    previouSearch.textContent = ele;

    previousContainer.append(previouSearch);

    previouSearch.addEventListener("click", () => {
      previousSearches.splice(index, 1);
      updateScreen();
    });
  });
  previousSearches.length !== 0
    ? clearSearch.classList.add("block")
    : clearSearch.classList.remove("block");

  displayAllJobs();
};

searchInput.addEventListener("keydown", (e) => {
  if (e.target.value.trim().length > 1 && e.keyCode === 13) {
    updateScreen();
    searchInput.value = "";
  }
});

clearSearch.addEventListener("click", () => {
  previousSearches = [];
  searchInput.value = "";
  updateScreen();
});
