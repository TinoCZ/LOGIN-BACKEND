import express from "express";
import workspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middlewares/auth.middlware.js";
import workspaceMiddleware from "../middlewares/workspace.middleware.js";

const workspaceRouter = express.Router()

workspaceRouter.get('/', authMiddleware, workspaceController.getWorkspaces)
workspaceRouter.post('/', authMiddleware, workspaceController.create)
workspaceRouter.delete('/:workspace_id', authMiddleware, workspaceController.delete)
workspaceRouter.post(
    '/:workspace_id/members', 
    authMiddleware, 
    workspaceMiddleware(['owner', 'admin']), 
    workspaceController.addMemberRequest
)
workspaceRouter.get('/:workspace_id/members/accept-invitation', workspaceController.acceptInvitation)
workspaceRouter.get(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(), 
    workspaceController.getWorkspaceById
)


export default workspaceRouter