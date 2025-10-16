// Data management
let data = {
    categories: [],
    prompts: []
};

let currentCategoryId = 'tots';
let editingPromptId = null;
let editingCategoryId = null;
let restoringPromptId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initEventListeners();
});

// Load data from JSON
async function loadData() {
    try {
        // Try to load from localStorage first
        const savedData = localStorage.getItem('promptsData');

        if (savedData) {
            data = JSON.parse(savedData);
        } else {
            // If no saved data, load from JSON file
            const response = await fetch('data/prompts.json');
            data = await response.json();
            // Save to localStorage
            saveToLocalStorage();
        }

        renderCategories();
        renderPrompts();
    } catch (error) {
        console.error('Error carregant les dades:', error);
        showToast('Error carregant les dades');
    }
}

// Save to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('promptsData', JSON.stringify(data));
    } catch (error) {
        console.error('Error desant a localStorage:', error);
    }
}

// Initialize event listeners
function initEventListeners() {
    // Header buttons
    document.getElementById('addPromptBtn').addEventListener('click', () => openPromptModal());
    document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryModal());
    document.getElementById('saveBtn').addEventListener('click', saveData);

    // Prompt modal
    document.getElementById('savePromptBtn').addEventListener('click', savePrompt);
    document.getElementById('cancelModalBtn').addEventListener('click', closePromptModal);
    document.getElementById('deletePromptBtn').addEventListener('click', deletePrompt);

    // Category modal
    document.getElementById('saveCategoryBtn').addEventListener('click', saveCategory);
    document.getElementById('cancelCategoryBtn').addEventListener('click', closeCategoryModal);
    document.getElementById('deleteCategoryBtn').addEventListener('click', deleteCategory);

    // Restore modal
    document.getElementById('confirmRestoreBtn').addEventListener('click', confirmRestore);
    document.getElementById('cancelRestoreBtn').addEventListener('click', closeRestoreModal);

    // Close modals with X button
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('show');
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
}

// Render categories
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    // Sort categories by order
    const sortedCategories = [...data.categories].sort((a, b) => a.order - b.order);

    sortedCategories.forEach(category => {
        const count = getPromptCountForCategory(category.id);
        const li = document.createElement('li');
        li.className = `category-item ${currentCategoryId === category.id ? 'active' : ''}`;
        li.dataset.categoryId = category.id;
        li.draggable = !category.special;

        li.innerHTML = `
            <span class="category-name">${category.name}</span>
            <span class="category-count">${count}</span>
        `;

        // Click to select category
        li.addEventListener('click', (e) => {
            if (!e.target.closest('.category-edit')) {
                selectCategory(category.id);
            }
        });

        // Double click to edit (only for non-special categories)
        if (!category.special) {
            li.addEventListener('dblclick', () => {
                openCategoryModal(category.id);
            });

            // Drag and drop for reordering categories
            li.addEventListener('dragstart', handleCategoryDragStart);
            li.addEventListener('dragend', handleCategoryDragEnd);
            li.addEventListener('dragover', handleCategoryDragOver);
            li.addEventListener('drop', handleCategoryDrop);
            li.addEventListener('dragleave', handleCategoryDragLeave);
        }

        categoryList.appendChild(li);
    });
}

// Get prompt count for category
function getPromptCountForCategory(categoryId) {
    if (categoryId === 'tots') {
        return data.prompts.filter(p => !p.deleted).length;
    } else if (categoryId === 'paperera') {
        return data.prompts.filter(p => p.deleted).length;
    } else {
        return data.prompts.filter(p => p.categoryId === categoryId && !p.deleted).length;
    }
}

// Select category
function selectCategory(categoryId) {
    currentCategoryId = categoryId;
    renderCategories();
    renderPrompts();
}

// Render prompts
function renderPrompts() {
    const container = document.getElementById('promptsContainer');
    container.innerHTML = '';

    let prompts = [];
    if (currentCategoryId === 'tots') {
        prompts = data.prompts.filter(p => !p.deleted);
    } else if (currentCategoryId === 'paperera') {
        prompts = data.prompts.filter(p => p.deleted);
    } else {
        prompts = data.prompts.filter(p => p.categoryId === currentCategoryId && !p.deleted);
    }

    if (prompts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Cap prompt aquí</h3>
                <p>Afegeix el teu primer prompt per començar</p>
            </div>
        `;
        return;
    }

    prompts.forEach(prompt => {
        const card = createPromptCard(prompt);
        container.appendChild(card);
    });
}

// Create prompt card
function createPromptCard(prompt) {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.dataset.promptId = prompt.id;
    card.draggable = true;

    const isInTrash = prompt.deleted;

    card.innerHTML = `
        <div class="prompt-header">
            <h3 class="prompt-title">${escapeHtml(prompt.title)}</h3>
        </div>
        <p class="prompt-description">${escapeHtml(prompt.description)}</p>
        <div class="prompt-actions">
            ${isInTrash ? `
                <button class="btn-restore" onclick="openRestoreModal('${prompt.id}')">♻️ Restaurar</button>
                <button class="btn-delete-permanent" onclick="deletePermanently('${prompt.id}')">🗑️ Esborrar</button>
            ` : `
                <button class="btn-copy" onclick="copyPrompt('${prompt.id}')">📋 Copiar</button>
            `}
        </div>
    `;

    // Double click to edit
    card.addEventListener('dblclick', () => {
        openPromptModal(prompt.id);
    });

    // Drag and drop
    card.addEventListener('dragstart', handlePromptDragStart);
    card.addEventListener('dragend', handlePromptDragEnd);

    return card;
}

// Copy prompt to clipboard
function copyPrompt(promptId) {
    const prompt = data.prompts.find(p => p.id === promptId);
    if (prompt) {
        navigator.clipboard.writeText(prompt.description).then(() => {
            showToast('Prompt copiat al portapapers!');
        }).catch(err => {
            console.error('Error copiant:', err);
            showToast('Error copiant el prompt');
        });
    }
}

// Delete permanently
function deletePermanently(promptId) {
    if (confirm('Estàs segur que vols esborrar aquest prompt definitivament? Aquesta acció no es pot desfer.')) {
        data.prompts = data.prompts.filter(p => p.id !== promptId);
        saveToLocalStorage();
        renderPrompts();
        renderCategories();
        showToast('Prompt esborrat definitivament');
    }
}

// Drag and drop handlers for prompts
let draggedPromptId = null;

function handlePromptDragStart(e) {
    draggedPromptId = e.target.dataset.promptId;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handlePromptDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.category-item').forEach(cat => {
        cat.classList.remove('drag-over');
    });
}

// Add drag over handler for categories
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('categoryList').addEventListener('dragover', (e) => {
        e.preventDefault();
        const target = e.target.closest('.category-item');
        if (target && draggedPromptId) {
            document.querySelectorAll('.category-item').forEach(cat => {
                cat.classList.remove('drag-over');
            });
            target.classList.add('drag-over');
        }
    });

    document.getElementById('categoryList').addEventListener('drop', (e) => {
        e.preventDefault();
        const target = e.target.closest('.category-item');
        if (target && draggedPromptId) {
            const targetCategoryId = target.dataset.categoryId;
            const prompt = data.prompts.find(p => p.id === draggedPromptId);

            if (prompt && targetCategoryId !== 'tots') {
                if (targetCategoryId === 'paperera') {
                    prompt.deleted = true;
                    showToast('Prompt mogut a la paperera');
                } else {
                    prompt.categoryId = targetCategoryId;
                    prompt.deleted = false;
                    showToast('Prompt mogut a la categoria');
                }
                saveToLocalStorage();
                renderPrompts();
                renderCategories();
            }

            target.classList.remove('drag-over');
        }
    });

    document.getElementById('categoryList').addEventListener('dragleave', (e) => {
        const target = e.target.closest('.category-item');
        if (target) {
            target.classList.remove('drag-over');
        }
    });
});

// Drag and drop handlers for categories
let draggedCategoryId = null;

function handleCategoryDragStart(e) {
    draggedCategoryId = e.target.dataset.categoryId;
    e.target.classList.add('dragging');
}

function handleCategoryDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.category-item').forEach(cat => {
        cat.classList.remove('drag-over');
    });
}

function handleCategoryDragOver(e) {
    e.preventDefault();
    const target = e.target.closest('.category-item');
    if (target && !target.dataset.categoryId) return;

    const category = data.categories.find(c => c.id === target.dataset.categoryId);
    if (category && !category.special) {
        target.classList.add('drag-over');
    }
}

function handleCategoryDrop(e) {
    e.preventDefault();
    const target = e.target.closest('.category-item');

    if (target && draggedCategoryId) {
        const targetCategoryId = target.dataset.categoryId;
        const targetCategory = data.categories.find(c => c.id === targetCategoryId);

        if (targetCategory && !targetCategory.special) {
            const draggedCategory = data.categories.find(c => c.id === draggedCategoryId);
            const targetOrder = targetCategory.order;
            const draggedOrder = draggedCategory.order;

            // Swap orders
            draggedCategory.order = targetOrder;
            targetCategory.order = draggedOrder;

            saveToLocalStorage();
            renderCategories();
            showToast('Categoria reordenada');
        }
    }

    target.classList.remove('drag-over');
}

function handleCategoryDragLeave(e) {
    const target = e.target.closest('.category-item');
    if (target) {
        target.classList.remove('drag-over');
    }
}

// Modal functions
function openPromptModal(promptId = null) {
    editingPromptId = promptId;
    const modal = document.getElementById('promptModal');
    const title = document.getElementById('modalTitle');
    const promptTitle = document.getElementById('promptTitle');
    const promptDescription = document.getElementById('promptDescription');
    const promptCategory = document.getElementById('promptCategory');
    const deleteBtn = document.getElementById('deletePromptBtn');

    // Populate category select
    promptCategory.innerHTML = '';
    data.categories.forEach(category => {
        if (!category.special) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            promptCategory.appendChild(option);
        }
    });

    if (promptId) {
        const prompt = data.prompts.find(p => p.id === promptId);
        title.textContent = 'Editar Prompt';
        promptTitle.value = prompt.title;
        promptDescription.value = prompt.description;
        promptCategory.value = prompt.categoryId;
        deleteBtn.style.display = 'block';
    } else {
        title.textContent = 'Nou Prompt';
        promptTitle.value = '';
        promptDescription.value = '';
        promptCategory.value = data.categories.find(c => !c.special)?.id || '';
        deleteBtn.style.display = 'none';
    }

    modal.classList.add('show');
    promptTitle.focus();
}

function closePromptModal() {
    document.getElementById('promptModal').classList.remove('show');
    editingPromptId = null;
}

function savePrompt() {
    const title = document.getElementById('promptTitle').value.trim();
    const description = document.getElementById('promptDescription').value.trim();
    const categoryId = document.getElementById('promptCategory').value;

    if (!title || !description) {
        showToast('Si us plau, omple tots els camps');
        return;
    }

    if (editingPromptId) {
        // Edit existing prompt
        const prompt = data.prompts.find(p => p.id === editingPromptId);
        prompt.title = title;
        prompt.description = description;
        prompt.categoryId = categoryId;
        showToast('Prompt actualitzat');
    } else {
        // Create new prompt
        const newPrompt = {
            id: generateId(),
            title: title,
            description: description,
            categoryId: categoryId,
            deleted: false,
            createdAt: new Date().toISOString()
        };
        data.prompts.push(newPrompt);
        showToast('Prompt creat');
    }

    saveToLocalStorage();
    closePromptModal();
    renderPrompts();
    renderCategories();
}

function deletePrompt() {
    if (editingPromptId) {
        const prompt = data.prompts.find(p => p.id === editingPromptId);
        if (prompt.deleted) {
            // Already in trash, delete permanently
            if (confirm('Estàs segur que vols esborrar aquest prompt definitivament?')) {
                data.prompts = data.prompts.filter(p => p.id !== editingPromptId);
                showToast('Prompt esborrat definitivament');
            }
        } else {
            // Move to trash
            prompt.deleted = true;
            showToast('Prompt mogut a la paperera');
        }
        saveToLocalStorage();
        closePromptModal();
        renderPrompts();
        renderCategories();
    }
}

function openCategoryModal(categoryId = null) {
    editingCategoryId = categoryId;
    const modal = document.getElementById('categoryModal');
    const categoryName = document.getElementById('categoryName');
    const deleteBtn = document.getElementById('deleteCategoryBtn');

    if (categoryId) {
        const category = data.categories.find(c => c.id === categoryId);
        categoryName.value = category.name;
        deleteBtn.style.display = 'block';
    } else {
        categoryName.value = '';
        deleteBtn.style.display = 'none';
    }

    modal.classList.add('show');
    categoryName.focus();
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
    editingCategoryId = null;
}

function saveCategory() {
    const name = document.getElementById('categoryName').value.trim();

    if (!name) {
        showToast('Si us plau, introdueix un nom');
        return;
    }

    if (editingCategoryId) {
        // Edit existing category
        const category = data.categories.find(c => c.id === editingCategoryId);
        category.name = name;
        showToast('Categoria actualitzada');
    } else {
        // Create new category
        const maxOrder = Math.max(...data.categories.filter(c => !c.special).map(c => c.order), 0);
        const newCategory = {
            id: generateId(),
            name: name,
            order: maxOrder + 1,
            special: false
        };
        data.categories.push(newCategory);
        showToast('Categoria creada');
    }

    saveToLocalStorage();
    closeCategoryModal();
    renderCategories();
}

function deleteCategory() {
    if (editingCategoryId) {
        const category = data.categories.find(c => c.id === editingCategoryId);

        if (category.special) {
            showToast('No es poden esborrar categories especials');
            return;
        }

        // Check if category has prompts
        const hasPrompts = data.prompts.some(p => p.categoryId === editingCategoryId && !p.deleted);

        if (hasPrompts) {
            showToast('No es pot esborrar una categoria amb prompts');
            return;
        }

        if (confirm('Estàs segur que vols esborrar aquesta categoria?')) {
            data.categories = data.categories.filter(c => c.id !== editingCategoryId);
            saveToLocalStorage();
            showToast('Categoria esborrada');
            closeCategoryModal();

            if (currentCategoryId === editingCategoryId) {
                selectCategory('tots');
            }

            renderCategories();
        }
    }
}

function openRestoreModal(promptId) {
    restoringPromptId = promptId;
    const modal = document.getElementById('restoreModal');
    const restoreCategory = document.getElementById('restoreCategory');
    const newCategoryName = document.getElementById('newCategoryName');

    // Populate category select
    restoreCategory.innerHTML = '';
    data.categories.forEach(category => {
        if (!category.special) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            restoreCategory.appendChild(option);
        }
    });

    newCategoryName.value = '';
    modal.classList.add('show');
}

function closeRestoreModal() {
    document.getElementById('restoreModal').classList.remove('show');
    restoringPromptId = null;
}

function confirmRestore() {
    const restoreCategory = document.getElementById('restoreCategory').value;
    const newCategoryName = document.getElementById('newCategoryName').value.trim();

    let targetCategoryId = restoreCategory;

    // Create new category if name provided
    if (newCategoryName) {
        const maxOrder = Math.max(...data.categories.filter(c => !c.special).map(c => c.order), 0);
        const newCategory = {
            id: generateId(),
            name: newCategoryName,
            order: maxOrder + 1,
            special: false
        };
        data.categories.push(newCategory);
        targetCategoryId = newCategory.id;
        showToast('Nova categoria creada');
    }

    // Restore prompt
    const prompt = data.prompts.find(p => p.id === restoringPromptId);
    if (prompt) {
        prompt.deleted = false;
        prompt.categoryId = targetCategoryId;
        showToast('Prompt restaurat');
    }

    saveToLocalStorage();
    closeRestoreModal();
    renderCategories();
    renderPrompts();
}

// Save data to JSON (Export to file)
async function saveData() {
    try {
        // Save to localStorage first
        saveToLocalStorage();

        // Create a blob and download it
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompts.json';
        a.click();
        URL.revokeObjectURL(url);

        showToast('JSON exportat! Pots substituir data/prompts.json si vols fer còpia de seguretat');
    } catch (error) {
        console.error('Error desant:', error);
        showToast('Error desant les dades');
    }
}

// Utility functions
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
