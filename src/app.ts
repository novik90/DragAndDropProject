//Validator
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatebleInput: Validatable) {
    let isValid = true;
    if (validatebleInput.required) {
        isValid =
            isValid && validatebleInput.value.toString().trim().length != 0;
    }
    if (
        validatebleInput.minLength != null &&
        typeof validatebleInput.value === "string"
    ) {
        isValid =
            isValid &&
            validatebleInput.value.length > validatebleInput.minLength;
    }
    if (
        validatebleInput.maxLength != null &&
        typeof validatebleInput.value === "string"
    ) {
        isValid =
            isValid &&
            validatebleInput.value.length < validatebleInput.maxLength;
    }
    if (
        validatebleInput.min != null &&
        typeof validatebleInput.value === "number"
    ) {
        isValid = isValid && validatebleInput.value > validatebleInput.min;
    }
    if (
        validatebleInput.max != null &&
        typeof validatebleInput.value === "number"
    ) {
        isValid = isValid && validatebleInput.value > validatebleInput.max;
    }
    return isValid;
}
//

//Autobind decorator
function Autobind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
//

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    desctiptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById(
            "project-input"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = "user-input";

        this.titleInputElement = this.element.querySelector(
            "#title"
        ) as HTMLInputElement;
        this.desctiptionInputElement = this.element.querySelector(
            "#description"
        ) as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector(
            "#people"
        ) as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.desctiptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        if (
            validate({ value: enteredTitle, required: true, minLength: 5 }) &&
            validate({
                value: enteredDescription,
                required: true,
                minLength: 5,
            }) &&
            validate({ value: enteredPeople, required: true, minLength: 5 })
        ) {
            alert("Invalid input, please try again!");
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = "";
        this.desctiptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    }
}

const prjInput = new ProjectInput();
