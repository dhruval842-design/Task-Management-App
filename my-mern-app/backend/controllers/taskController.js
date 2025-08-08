const Task = require('../models/taskModel');

const createTask = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { title, description, status } = req.body;
        const taskCreate = new Task({
            title,
            description,
            status,
            createdBy: userId
        });
        await taskCreate.save();
        res.status(201).json({
            message: "Task created successfully",
            task: taskCreate
        })
    } catch (error) {
        console.error("Internal server occur during task creation", error);
        res.status(500).json({
            message: "Internal server occur during task creation"
        })
    }
};


const displayTask = async (req, res) => {
    try {

        const userId = req.userData.userId;
        const { status } = req.query;
        const filter = { createdBy: userId };

        if (status && status !== 'all') {
            filter.status = status;
        };

        const tasks = await Task.find(filter);
        if (tasks.length === 0) {
            return res.status(400).json({
                message: "No tasks found for the user with specified status"
            })
        }
        else {
            return res.status(200).json(tasks);
        }
    } catch (error) {
        console.error("Internal server error fetching tasks:", error);
        res.status(500).json({
            message: "Internal server error fetching tasks"
        })
    }
};


const editTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const userId = req.userData.userId;
        const taskId = req.params.taskId;


        const task = await Task.findOneAndUpdate(
            { _id: taskId, createdBy: userId },
            { title, description, status, updatedAt: Date.now() },
            { new: true, runValidators: true }  
        );
        if (!task) {
            return res.status(404).json({
                message: "Task doesn't found you or you are not authorised to modify this task"
            });
        }

        await task.save();
        res.status(201).json({
            message: "Task updated successfully",
            task: task
        });


    } catch (error) {
        console.error("Internal server error at editing tasks:", error);
        res.status(500).json({
            message: "Internal server error at editing tasks"
        })
    }
};


const completeTask = async (req, res) => {
    try {
       
        const userId = req.userData.userId;
        const taskId = req.params.taskId;

        const task = await Task.findOneAndUpdate(
            { _id: taskId, createdBy: userId },
            { status: "completed", updatedAt: Date.now() },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({
                message: "Task doesn't found or you are not authorized to modify this task."
            })
        };
        await task.save();
        res.status(200).json({
            message: "Task marked as completed successfully",
            task: task
        });

    } catch (error) {
        console.error("Internal server error at completed tasks:", error);
        res.status(500).json({
            message: "Internal server error at completed tasks"
        })
    }
};


const deleteTask = async (req, res) => {
    try {
        
        const userId = req.userData.userId;
        const taskId = req.params.taskId;

        const result = await Task.deleteOne({ _id: taskId, createdBy: userId });
        if (result.deletedCount === 0) {
            return res.status(400).json({
                message: "Task doesn't exist you can't delete task"
            })
        }
        res.status(200).json({
            message: "Task deleted successfully"
        })

    } catch (error) {
        console.error("Internal server error during deleting tasks:", error);
        res.status(500).json({
            message: "Internal server error during deleting tasks"
        })
    }
};



module.exports = {
    createTask,
    editTask,
    completeTask,
    deleteTask,
    displayTask
};