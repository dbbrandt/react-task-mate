import React, {ChangeEvent, FormEvent, useState} from "react";
import {useCreateTaskMutation} from "../../generated/graphql-frontend";

interface FormProps {
    onSuccess: () => void;
}

const CreateTaskForm: React.FC<FormProps> = ({onSuccess}) => {
    const [ title, setTitle ] = useState("");
    const [createTask, { loading, error}] = useCreateTaskMutation({
        onCompleted: () => {
            onSuccess(); // refreshes the data and thus the page.
            setTitle('');
        }
    });


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleSubmit = async (event:  FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!loading) { // Prevents duplicate tasks getting created with quick double submit
            try {
                await createTask({ variables: { input: {title: title}}});
            } catch (e) {
                // log error
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="alert-error">An error occured.</p>}
            <input className="text-input new-task-text-input"
                   type="text"
                   placeholder="What would you like to get done?"
                   autoComplete="off"
                   value={title}
                   onChange={handleChange}
            />
        </form>
    )
}

export default CreateTaskForm;
