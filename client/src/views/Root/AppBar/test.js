// external imports
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
// local imports
import AppBar from './.'

test('highlights the fund link when on /funds', async () => {
    // mount the app bar on /fund
    const wrapper = mount(
        <MemoryRouter initialEntries={['/funds']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/funds"]')
    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})

test('highlights the projects link when on /projects', async () => {
    // mount the app bar on /projects
    const wrapper = mount(
        <MemoryRouter initialEntries={['/projects']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/projects"]')

    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})

test('highlights the settings link when on /settings', async () => {
    // mount the app bar on /settings
    const wrapper = mount(
        <MemoryRouter initialEntries={['/settings']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/settings"]')

    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})

test('highlights the projects link when on a specific project', async () => {
    // mount the app bar on a repo page
    const wrapper = mount(
        <MemoryRouter initialEntries={['/AlecAivazis/survey']}>
            <AppBar />
        </MemoryRouter>
    )

    // find the link that points to this page
    const link = wrapper.find('NavLink[to="/projects"]')

    // make sure we found it
    expect(link).toHaveLength(1)
    // make sure its highlighted
    expect(link.props().match).toBeTruthy()

    // make sure its the only one highlighted
    expect(wrapper.find('NavLink[match=false]')).toHaveLength(2)
})
